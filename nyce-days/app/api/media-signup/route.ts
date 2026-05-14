import { NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { Resend } from 'resend'
import { MEDIA_EVENTS } from '@/lib/media-events'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const stripAt = (val: string) => val.trim().replace(/^@+/, '')

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  email: z.string().email('Invalid email'),
  phone: z.string().min(7, 'Phone is required').max(40),
  instagram: z.string().min(1, 'Instagram is required').max(80).transform(stripAt),
  portfolio_url: z
    .string()
    .trim()
    .url('Must be a valid URL (https://...)')
    .max(500)
    .optional()
    .or(z.literal('').transform(() => undefined)),

  does_photo: z.boolean(),
  does_video: z.boolean(),
  does_interviews: z.boolean(),
  does_other: z.boolean(),
  other_capability: z.string().max(200).optional(),

  planned_checkin_time: z.string().max(300).optional(),
  assistance_needed: z.string().max(1000).optional(),
  additional_notes: z.string().max(2000).optional(),

  ack_share_flyer: z.boolean(),
  ack_share_ticket_link: z.boolean(),
  ack_no_interrupt: z.boolean(),
  ack_share_media: z.boolean(),

  event_slug: z.string().min(1).max(120),
}).refine(
  d => d.does_photo || d.does_video || d.does_interviews || d.does_other,
  { message: 'Tell us at least one thing you cover.', path: ['does_photo'] }
).refine(
  d => !d.does_other || (d.other_capability && d.other_capability.trim().length > 0),
  { message: 'Specify what else you cover.', path: ['other_capability'] }
).refine(
  d => d.ack_share_flyer && d.ack_share_ticket_link && d.ack_no_interrupt && d.ack_share_media,
  { message: 'All four acknowledgments are required to apply.', path: ['ack_share_flyer'] }
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = schema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }
    const data = result.data

    // Resolve event (validate it's one we know about)
    const eventMeta = MEDIA_EVENTS[data.event_slug]
    if (!eventMeta) {
      return NextResponse.json(
        { success: false, error: 'Unknown event.' },
        { status: 400 }
      )
    }

    const row = {
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone.trim(),
      instagram: data.instagram, // already stripped of leading @
      portfolio_url: data.portfolio_url?.trim() || null,

      does_photo: Boolean(data.does_photo),
      does_video: Boolean(data.does_video),
      does_interviews: Boolean(data.does_interviews),
      other_capability: data.does_other ? (data.other_capability?.trim() || null) : null,

      planned_checkin_time: data.planned_checkin_time?.trim() || null,
      assistance_needed: data.assistance_needed?.trim() || null,
      additional_notes: data.additional_notes?.trim() || null,

      ack_share_flyer: data.ack_share_flyer,
      ack_share_ticket_link: data.ack_share_ticket_link,
      ack_no_interrupt: data.ack_no_interrupt,
      ack_share_media: data.ack_share_media,

      read: false,
      archived: false,
      approved: false,
      attended: false,
      media_delivered: false,

      event_slug: data.event_slug,
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: inserted, error } = await (supabaseAdmin as any)
      .from('media_submissions')
      .insert(row)
      .select()
      .single()

    if (error) {
      console.error('Media submission insert error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to save submission. Please try again.' },
        { status: 500 }
      )
    }

    // Email Bryce (best effort)
    if (resend && process.env.CONTACT_EMAIL) {
      try {
        const escapeHtml = (s: string) =>
          s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;')

        const line = (label: string, value: string | null | undefined) =>
          value ? `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>` : ''

        const capabilities = [
          row.does_photo && 'Photo',
          row.does_video && 'Video',
          row.does_interviews && 'Interviews',
          row.other_capability && `Other (${row.other_capability})`,
        ].filter(Boolean).join(', ') || 'None selected'

        await resend.emails.send({
          from: 'Nyce Days <notifications@nycedays.com>',
          to: process.env.CONTACT_EMAIL,
          subject: `[Media Signup] ${eventMeta.name} - ${row.name}`,
          html: `
            <h2>New Media Signup</h2>
            <p><strong>Event:</strong> ${escapeHtml(eventMeta.name)} (${escapeHtml(eventMeta.date)})</p>
            <p><strong>Slug:</strong> ${escapeHtml(eventMeta.slug)}</p>

            <h3>Identity</h3>
            ${line('Name', row.name)}
            <p><strong>Email:</strong> <a href="mailto:${row.email}">${escapeHtml(row.email)}</a></p>
            ${line('Phone', row.phone)}
            <p><strong>Instagram:</strong> <a href="https://instagram.com/${escapeHtml(row.instagram)}">@${escapeHtml(row.instagram)}</a></p>
            ${row.portfolio_url ? `<p><strong>Portfolio:</strong> <a href="${row.portfolio_url}">${escapeHtml(row.portfolio_url)}</a></p>` : ''}

            <h3>Capabilities</h3>
            <p>${escapeHtml(capabilities)}</p>

            <h3>The day</h3>
            ${line('Planned check-in', row.planned_checkin_time)}
            ${line('Assistance needed', row.assistance_needed)}
            ${line('Additional notes', row.additional_notes)}

            <h3>Acknowledgments</h3>
            <p>Share flyer: ${row.ack_share_flyer ? 'Yes' : 'No'}</p>
            <p>Share ticket link: ${row.ack_share_ticket_link ? 'Yes' : 'No'}</p>
            <p>No interrupt: ${row.ack_no_interrupt ? 'Yes' : 'No'}</p>
            <p>Share media within 72h: ${row.ack_share_media ? 'Yes' : 'No'}</p>

            <hr/>
            <p><small>Received at ${new Date().toLocaleString()}</small></p>
          `,
        })
      } catch (emailError) {
        console.error('Media signup email error:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Application received.',
      id: inserted?.id,
    })
  } catch (err) {
    console.error('Media signup API error:', err)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
