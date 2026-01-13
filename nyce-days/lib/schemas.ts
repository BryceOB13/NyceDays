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

export type ContactFormData = z.infer<typeof contactFormSchema>
export type SubscribeData = z.infer<typeof subscribeSchema>
