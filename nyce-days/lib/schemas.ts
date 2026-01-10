import { z } from 'zod'

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
  email: z.string().email('Invalid email address'),
  source: z.enum(['footer', 'community', 'shop', 'contact']).optional()
})

export type ContactFormData = z.infer<typeof contactFormSchema>
export type SubscribeData = z.infer<typeof subscribeSchema>
