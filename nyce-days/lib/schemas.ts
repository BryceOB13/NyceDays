import { z } from 'zod'

// Strict email validation regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const emailSchema = z.string()
  .min(1, 'Email is required')
  .email('Invalid email address')
  .refine((email) => emailRegex.test(email), {
    message: 'Please enter a valid email address'
  })

// Phone validation (US format)
export const phoneSchema = z.string()
  .min(1, 'Phone is required')
  .refine((phone) => {
    const digits = phone.replace(/\D/g, '')
    return digits.length === 10
  }, { message: 'Please enter a valid 10-digit phone number' })

// Helper to validate email (for use in components)
export const isValidEmail = (email: string): boolean => {
  return emailRegex.test(email)
}

export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less').refine(
    (val) => val.trim().length > 0,
    { message: 'Name cannot be only whitespace' }
  ),
  email: z.string().email('Invalid email address'),
  company: z.string().max(100, 'Company must be 100 characters or less').optional(),
  inquiry_type: z.enum(['partnership', 'event', 'content', 'general'], {
    error: 'Please select an inquiry type'
  }),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000, 'Message must be 5000 characters or less').refine(
    (val) => val.trim().length >= 10,
    { message: 'Message must contain at least 10 non-whitespace characters' }
  ),
  referral: z.string().max(200, 'Referral must be 200 characters or less').optional()
})

export const subscribeSchema = z.object({
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  first_name: z.string().max(50).optional(),
  source: z.enum(['footer', 'community', 'shop', 'contact', 'modal']).optional(),
  sms_consent: z.boolean().optional(),
  email_consent: z.boolean().optional(),
}).refine((data) => data.email || data.phone, {
  message: 'Either email or phone is required'
})

// Casting / collaborator onboarding (summer campaign)
export const CASTING_ROLES = [
  'creative_director',
  'camera_content',
  'model_actor',
  'photographer',
  'stylist',
  'other',
] as const

export const castingSchema = z.object({
  // contact
  full_name: z.string().min(1, 'Your name is required').max(120).refine(v => v.trim().length > 0, 'Your name is required'),
  email: emailSchema,
  phone: phoneSchema,
  instagram_handle: z.string().max(80).optional().nullable(),
  other_socials: z.string().max(300).optional().nullable(),
  portfolio_url: z.string().max(500).optional().nullable(),
  contact_preference: z.enum(['sms', 'email', 'instagram', 'call']).default('instagram'),
  pronouns: z.string().max(60).optional().nullable(),

  // location
  city: z.enum(['dc', 'maryland', 'virginia', 'other'], { error: 'Pick your city' }),
  area: z.string().max(120).optional().nullable(),
  is_18_plus: z.boolean().refine(v => v === true, { message: 'You must be 18 or older to apply' }),
  has_transport: z.boolean().optional(),

  // who they are
  applicant_type: z.array(z.enum(['talent', 'crew', 'featured'])).min(1, 'Pick at least one'),
  roles: z.array(z.enum(CASTING_ROLES)).default([]),
  role_other: z.string().max(120).optional().nullable(),
  headline: z.string().max(160).optional().nullable(),
  bio: z.string().max(1000).optional().nullable(),
  experience: z.string().max(2000).optional().nullable(),

  // availability
  availability: z.object({
    presets: z.array(z.string()).default([]),
    grid: z.record(z.string(), z.array(z.string())).default({}),
    weeks: z.array(z.string()).default([]),
    notes: z.string().max(500).optional().default(''),
  }).default({ presets: [], grid: {}, weeks: [], notes: '' }),
  earliest_date: z.string().optional().nullable(),

  // wrap
  release_ok: z.boolean().refine(v => v === true, { message: 'A release is required to be on camera' }),
  heard_from: z.string().max(200).optional().nullable(),
  anything_else: z.string().max(1000).optional().nullable(),
  sms_consent: z.boolean().optional(),
  email_consent: z.boolean().optional(),
})

export type CastingData = z.infer<typeof castingSchema>
export type ContactFormData = z.infer<typeof contactFormSchema>
export type SubscribeData = z.infer<typeof subscribeSchema>
