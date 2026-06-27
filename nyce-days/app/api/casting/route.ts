import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { castingSchema } from '@/lib/schemas'
import { Resend } from 'resend'

// Service-role client, server-side only (mirrors /api/subscribe + /api/vendor)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Basic best-effort rate limit (per warm instance) — honeypot is the primary bot gate
const RATE = new Map<string, number>()
const WINDOW_MS = 15_000

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Honeypot — if the hidden field is filled, treat as a bot and fake-succeed
    if (typeof body?.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ success: true })
    }

    // Basic rate limit by IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const now = Date.now()
    if (now - (RATE.get(ip) || 0) < WINDOW_MS) {
      return NextResponse.json(
        { success: false, error: 'Slow down a sec and try again.' },
        { status: 429 }
      )
    }

    const result = castingSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }
    RATE.set(ip, now)

    const d = result.data
    const email = d.email.toLowerCase().trim()
    const firstName = d.full_name.trim().split(' ')[0] || null
    const digits = d.phone.replace(/\D/g, '')
    const formattedPhone = digits.length === 10 ? `+1${digits}` : d.phone.trim()
    const instagram = d.instagram_handle ? d.instagram_handle.trim().replace(/^@+/, '') : null

    const row = {
      full_name: d.full_name.trim(),
      email,
      phone: d.phone.trim(),
      instagram_handle: instagram,
      other_socials: d.other_socials?.trim() || null,
      portfolio_url: d.portfolio_url?.trim() || null,
      contact_preference: d.contact_preference,
      sms_consent: Boolean(d.sms_consent),
      email_consent: Boolean(d.email_consent),

      applicant_type: d.applicant_type,
      roles: d.roles,
      role_other: d.role_other?.trim() || null,
      headline: d.headline?.trim() || null,
      bio: d.bio?.trim() || null,
      experience: d.experience?.trim() || null,
      pronouns: d.pronouns?.trim() || null,
      is_18_plus: d.is_18_plus,

      city: d.city,
      area: d.area?.trim() || null,
      has_transport: Boolean(d.has_transport),

      availability: d.availability,
      earliest_date: d.earliest_date || null,

      release_ok: d.release_ok,
      heard_from: d.heard_from?.trim() || null,
      anything_else: d.anything_else?.trim() || null,

      status: 'new',
      approved: false,
      read: false,
      archived: false,
      campaign: 'summer-2026',
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: inserted, error } = await (supabase as any)
      .from('casting_submissions')
      .insert(row)
      .select('id')
      .single()

    if (error) {
      console.error('Casting insert error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to save. Please try again.' },
        { status: 500 }
      )
    }

    // Email / SMS capture — only with consent (mirrors /api/subscribe upserts)
    try {
      if (d.sms_consent) {
        await supabase.from('sms_subscribers').upsert(
          {
            phone: formattedPhone,
            first_name: firstName,
            email,
            sms_consent: true,
            source: 'casting',
            subscribed: true,
            subscribed_at: new Date().toISOString(),
          },
          { onConflict: 'phone' }
        )
      }
      if (d.email_consent) {
        await supabase.from('subscribers').upsert(
          {
            email,
            first_name: firstName,
            phone: formattedPhone,
            email_consent: true,
            sms_consent: Boolean(d.sms_consent),
            source: 'casting',
            subscribed: true,
            subscribed_at: new Date().toISOString(),
          },
          { onConflict: 'email' }
        )
      }
    } catch (subErr) {
      console.error('Casting subscriber upsert error:', subErr)
      // Don't fail the request if list capture fails
    }

    // Notify the team (best-effort) — mirrors contact/vendor
    if (resend && process.env.CONTACT_EMAIL) {
      try {
        const a = d.availability
        const line = (label: string, value: string | null | undefined) =>
          value ? `<p><strong>${label}:</strong> ${esc(value)}</p>` : ''

        await resend.emails.send({
          from: 'Nyce Days <notifications@nycedays.com>',
          to: process.env.CONTACT_EMAIL,
          subject: `New casting signup: ${row.full_name} (${d.applicant_type.join(', ')})`,
          html: `
            <h2>New Casting / Collaborator Signup</h2>
            <p><strong>Name:</strong> ${esc(row.full_name)}${row.pronouns ? ` (${esc(row.pronouns)})` : ''}</p>
            <p><strong>Email:</strong> <a href="mailto:${esc(row.email)}">${esc(row.email)}</a></p>
            <p><strong>Phone:</strong> ${esc(row.phone)} · prefers ${esc(row.contact_preference)}</p>
            ${row.instagram_handle ? `<p><strong>IG:</strong> <a href="https://instagram.com/${esc(row.instagram_handle)}">@${esc(row.instagram_handle)}</a></p>` : ''}
            ${line('Other socials', row.other_socials)}
            ${row.portfolio_url ? `<p><strong>Portfolio:</strong> <a href="${esc(row.portfolio_url)}">${esc(row.portfolio_url)}</a></p>` : ''}
            <p><strong>Location:</strong> ${esc(row.city)}${row.area ? ` · ${esc(row.area)}` : ''} · 18+: ${row.is_18_plus ? 'yes' : 'no'} · transport: ${row.has_transport ? 'yes' : 'no'}</p>
            <h3>What they bring</h3>
            <p><strong>Applying as:</strong> ${esc(d.applicant_type.join(', '))}</p>
            <p><strong>Roles:</strong> ${esc(d.roles.join(', ') || '—')}${row.role_other ? ` · other: ${esc(row.role_other)}` : ''}</p>
            ${line('Headline', row.headline)}
            ${line('Bio', row.bio)}
            ${line('Experience', row.experience)}
            <h3>Availability</h3>
            <p><strong>Presets:</strong> ${esc((a.presets || []).join(', ') || '—')}</p>
            <p><strong>July weeks:</strong> ${esc((a.weeks || []).join(', ') || '—')}</p>
            ${line('Notes', a.notes)}
            ${line('Earliest date', row.earliest_date)}
            <h3>Wrap</h3>
            <p><strong>Release OK:</strong> ${row.release_ok ? 'yes' : 'no'}</p>
            ${line('Heard from', row.heard_from)}
            ${line('Anything else', row.anything_else)}
            <p><strong>Consent:</strong> sms ${row.sms_consent ? 'yes' : 'no'} · email ${row.email_consent ? 'yes' : 'no'}</p>
            <hr/><p><small>${new Date().toLocaleString()} · campaign summer-2026</small></p>
          `,
        })
      } catch (emailError) {
        console.error('Casting email error:', emailError)
      }
    }

    return NextResponse.json({ success: true, id: inserted?.id })
  } catch (err) {
    console.error('Casting API error:', err)
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
