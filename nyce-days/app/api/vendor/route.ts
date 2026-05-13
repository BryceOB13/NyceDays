import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const MAX_FILES = 5
const MAX_FILE_BYTES = 10 * 1024 * 1024 // 10 MB
const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/heic',
  'image/heif',
])

const boolFromForm = (val: unknown): boolean => {
  if (typeof val === 'string') return val === 'true' || val === 'on' || val === '1'
  return Boolean(val)
}

const stripAt = (val: string) => val.trim().replace(/^@+/, '')

const vendorSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  email: z.string().email('Invalid email'),
  phone: z.string().min(7, 'Phone is required').max(40),
  instagram: z.string().min(1, 'Instagram is required').max(80).transform(stripAt),
  business_name: z.string().max(120).optional().nullable(),

  menu_items: z.string().min(3, 'Tell us what you\u2019re serving').max(4000),
  quantity_estimate: z.string().min(1, 'Estimate is required').max(200),
  allergens: z.string().max(500).optional().nullable(),

  arrival_choice: z.enum(['by_3pm', 'specific']),
  arrival_specific_time: z.string().max(120).optional().nullable(),
  bringing: z.string().max(500).optional().nullable(),
  special_needs: z.string().max(500).optional().nullable(),

  share_flyer: z.boolean().refine(v => v === true, { message: 'You must agree to share the flyer' }),
  feature_optin: z.boolean().optional(),
  tag_handles: z.string().max(300).optional().nullable(),

  // Gate-only (NOT stored in DB)
  menu_confirmation_acknowledged: z.boolean().refine(v => v === true, {
    message: 'Please confirm you\u2019ll share your menu with a rep',
  }),
})

export async function POST(request: Request) {
  try {
    const form = await request.formData()

    // Parse scalar fields
    const parsed = {
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      phone: String(form.get('phone') ?? ''),
      instagram: String(form.get('instagram') ?? ''),
      business_name: (form.get('business_name') as string) || null,
      menu_items: String(form.get('menu_items') ?? ''),
      quantity_estimate: String(form.get('quantity_estimate') ?? ''),
      allergens: (form.get('allergens') as string) || null,
      arrival_choice: String(form.get('arrival_choice') ?? '') as 'by_3pm' | 'specific',
      arrival_specific_time: (form.get('arrival_specific_time') as string) || null,
      bringing: (form.get('bringing') as string) || null,
      special_needs: (form.get('special_needs') as string) || null,
      share_flyer: boolFromForm(form.get('share_flyer')),
      feature_optin: boolFromForm(form.get('feature_optin')),
      tag_handles: (form.get('tag_handles') as string) || null,
      menu_confirmation_acknowledged: boolFromForm(form.get('menu_confirmation_acknowledged')),
    }

    const result = vendorSchema.safeParse(parsed)
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

    // Handle file uploads
    const files = form.getAll('menu_photos').filter((v): v is File => v instanceof File && v.size > 0)
    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { success: false, error: `Max ${MAX_FILES} photos allowed.` },
        { status: 400 }
      )
    }

    const photoUrls: string[] = []
    for (const file of files) {
      if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json(
          { success: false, error: `${file.name} is over 10MB.` },
          { status: 400 }
        )
      }
      if (!ALLOWED_MIME.has(file.type.toLowerCase())) {
        return NextResponse.json(
          { success: false, error: `${file.name} is not an accepted image type.` },
          { status: 400 }
        )
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const storagePath = `vendor-photos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`

      const { error: uploadError } = await supabaseAdmin.storage
        .from('media')
        .upload(storagePath, file, {
          contentType: file.type,
          upsert: false,
        })

      if (uploadError) {
        console.error('Vendor photo upload error:', uploadError)
        return NextResponse.json(
          { success: false, error: 'Failed to upload one of the photos. Try again.' },
          { status: 500 }
        )
      }

      const { data: urlData } = supabaseAdmin.storage.from('media').getPublicUrl(storagePath)
      photoUrls.push(urlData.publicUrl)
    }

    // Build row for DB (gate-only field is intentionally NOT included)
    const row = {
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone.trim(),
      instagram: data.instagram, // already stripped of leading @
      business_name: data.business_name?.trim() || null,

      menu_items: data.menu_items.trim(),
      quantity_estimate: data.quantity_estimate.trim(),
      allergens: data.allergens?.trim() || null,
      menu_photo_urls: photoUrls,

      arrival_by_3pm: data.arrival_choice === 'by_3pm',
      arrival_specific_time:
        data.arrival_choice === 'specific' ? (data.arrival_specific_time?.trim() || null) : null,
      bringing: data.bringing?.trim() || null,
      special_needs: data.special_needs?.trim() || null,

      share_flyer: data.share_flyer,
      feature_optin: Boolean(data.feature_optin),
      tag_handles: data.tag_handles?.trim() || null,

      read: false,
      archived: false,
      // event_slug uses column default
    }

    const supabase = await createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: inserted, error } = await (supabase as any)
      .from('vendor_submissions')
      .insert(row)
      .select()
      .single()

    if (error) {
      console.error('Vendor insert error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to save submission. Please try again.' },
        { status: 500 }
      )
    }

    // Email Bryce (non-blocking, best-effort)
    if (resend && process.env.CONTACT_EMAIL) {
      try {
        const escapeHtml = (s: string) =>
          s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
        const line = (label: string, value: string | null | undefined) =>
          value ? `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>` : ''

        const arrivalStr = row.arrival_by_3pm
          ? 'By 3pm'
          : `Specific time: ${row.arrival_specific_time || 'unspecified'}`

        const photosHtml = photoUrls.length
          ? `<p><strong>Menu photos:</strong></p><ul>${photoUrls
              .map(u => `<li><a href="${u}">${u}</a></li>`)
              .join('')}</ul>`
          : '<p><strong>Menu photos:</strong> none uploaded</p>'

        await resend.emails.send({
          from: 'Nyce Days <notifications@nycedays.com>',
          to: process.env.CONTACT_EMAIL,
          subject: `New vendor signup: ${row.name}${row.business_name ? ` (${row.business_name})` : ''}`,
          html: `
            <h2>New Vendor Signup · THE YARD</h2>
            <p><strong>Event:</strong> the-yard-2026-05-24</p>

            <h3>Contact</h3>
            ${line('Name', row.name)}
            ${line('Business', row.business_name)}
            <p><strong>Email:</strong> <a href="mailto:${row.email}">${escapeHtml(row.email)}</a></p>
            ${line('Phone', row.phone)}
            <p><strong>Instagram:</strong> <a href="https://instagram.com/${escapeHtml(row.instagram)}">@${escapeHtml(row.instagram)}</a></p>

            <h3>Menu</h3>
            <p><strong>Menu items:</strong><br/>${escapeHtml(row.menu_items).replace(/\n/g, '<br/>')}</p>
            ${line('Quantity estimate', row.quantity_estimate)}
            ${line('Allergens', row.allergens)}
            ${photosHtml}

            <h3>Logistics</h3>
            <p><strong>Arrival:</strong> ${escapeHtml(arrivalStr)}</p>
            ${line('Bringing', row.bringing)}
            ${line('Special needs', row.special_needs)}

            <h3>Promo</h3>
            <p><strong>Share flyer:</strong> ${row.share_flyer ? 'Yes' : 'No'}</p>
            <p><strong>Feature opt-in:</strong> ${row.feature_optin ? 'Yes' : 'No'}</p>
            ${line('Tag handles', row.tag_handles)}

            <h3>Gate</h3>
            <p><strong>Confirmed menu sharing with rep:</strong> ${data.menu_confirmation_acknowledged ? 'Yes' : 'No'}</p>

            <hr/>
            <p><small>Received at ${new Date().toLocaleString()}</small></p>
          `,
        })
      } catch (emailError) {
        console.error('Vendor email error:', emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Submission received.',
      id: inserted?.id,
    })
  } catch (err) {
    console.error('Vendor API error:', err)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
