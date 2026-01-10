import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { subscribeSchema, contactFormSchema } from '../../lib/schemas'

// Custom email generator that produces emails Zod will accept
// Zod's email validation is stricter - no trailing dots, no special chars at start/end
const zodCompatibleEmail = fc.tuple(
  fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9]{0,20}$/),
  fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9]{0,10}$/),
  fc.constantFrom('com', 'org', 'net', 'io', 'co')
).map(([local, domain, tld]) => `${local}@${domain}.${tld}`)

/**
 * Feature: nyce-days-website, Property 5: Email Validation
 * 
 * *For any* string that is not a valid email format (missing @, invalid domain, etc.),
 * the `subscribeSchema.safeParse()` must return `success: false` with an appropriate error message.
 * 
 * **Validates: Requirements 6.6**
 */
describe('Property 5: Email Validation', () => {
  it('should reject strings without @ symbol', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => !s.includes('@') && s.length > 0),
        (invalidEmail) => {
          const result = subscribeSchema.safeParse({ email: invalidEmail })
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues.some(issue => issue.path.includes('email'))).toBe(true)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should reject strings with @ but no domain', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => s.length > 0 && !s.includes('@')).map(s => `${s}@`),
        (invalidEmail) => {
          const result = subscribeSchema.safeParse({ email: invalidEmail })
          expect(result.success).toBe(false)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should reject strings with @ but invalid domain format', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.string().filter(s => s.length > 0 && !s.includes('@')),
          fc.string().filter(s => s.length > 0 && !s.includes('.') && !s.includes('@'))
        ).map(([local, domain]) => `${local}@${domain}`),
        (invalidEmail) => {
          const result = subscribeSchema.safeParse({ email: invalidEmail })
          expect(result.success).toBe(false)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should accept valid email formats', () => {
    fc.assert(
      fc.property(
        zodCompatibleEmail,
        (validEmail) => {
          const result = subscribeSchema.safeParse({ email: validEmail })
          expect(result.success).toBe(true)
        }
      ),
      { numRuns: 100 }
    )
  })
})

/**
 * Feature: nyce-days-website, Property 6: Contact Form Validation
 * 
 * *For any* contact form data where a required field (name, email, inquiry_type, message) is missing or invalid,
 * the `contactFormSchema.safeParse()` must return `success: false` with error messages for each invalid field.
 * 
 * **Validates: Requirements 8.5**
 */
describe('Property 6: Contact Form Validation', () => {
  const validInquiryTypes = ['partnership', 'event', 'content', 'general'] as const
  
  // Non-whitespace string generator for valid names
  const validName = fc.stringMatching(/^[a-zA-Z][a-zA-Z\s]{0,98}[a-zA-Z]$/).filter(s => s.trim().length > 0)
  
  // Non-whitespace string generator for valid messages (at least 10 chars after trim)
  const validMessage = fc.stringMatching(/^[a-zA-Z][a-zA-Z\s]{8,98}[a-zA-Z]$/).filter(s => s.trim().length >= 10)

  it('should reject forms with missing name', () => {
    fc.assert(
      fc.property(
        fc.record({
          email: zodCompatibleEmail,
          inquiry_type: fc.constantFrom(...validInquiryTypes),
          message: validMessage
        }),
        (formData) => {
          const result = contactFormSchema.safeParse(formData)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues.some(issue => issue.path.includes('name'))).toBe(true)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should reject forms with missing email', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: validName,
          inquiry_type: fc.constantFrom(...validInquiryTypes),
          message: validMessage
        }),
        (formData) => {
          const result = contactFormSchema.safeParse(formData)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues.some(issue => issue.path.includes('email'))).toBe(true)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should reject forms with invalid email', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: validName,
          email: fc.string().filter(s => !s.includes('@') && s.length > 0),
          inquiry_type: fc.constantFrom(...validInquiryTypes),
          message: validMessage
        }),
        (formData) => {
          const result = contactFormSchema.safeParse(formData)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues.some(issue => issue.path.includes('email'))).toBe(true)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should reject forms with missing inquiry_type', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: validName,
          email: zodCompatibleEmail,
          message: validMessage
        }),
        (formData) => {
          const result = contactFormSchema.safeParse(formData)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues.some(issue => issue.path.includes('inquiry_type'))).toBe(true)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should reject forms with invalid inquiry_type', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: validName,
          email: zodCompatibleEmail,
          inquiry_type: fc.string().filter(s => !validInquiryTypes.includes(s as any) && s.length > 0),
          message: validMessage
        }),
        (formData) => {
          const result = contactFormSchema.safeParse(formData)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues.some(issue => issue.path.includes('inquiry_type'))).toBe(true)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should reject forms with missing message', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: validName,
          email: zodCompatibleEmail,
          inquiry_type: fc.constantFrom(...validInquiryTypes)
        }),
        (formData) => {
          const result = contactFormSchema.safeParse(formData)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues.some(issue => issue.path.includes('message'))).toBe(true)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should reject forms with message too short', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: validName,
          email: zodCompatibleEmail,
          inquiry_type: fc.constantFrom(...validInquiryTypes),
          message: fc.stringMatching(/^[a-zA-Z]{1,9}$/)
        }),
        (formData) => {
          const result = contactFormSchema.safeParse(formData)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues.some(issue => issue.path.includes('message'))).toBe(true)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should reject forms with whitespace-only name', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.stringMatching(/^\s+$/).filter(s => s.length > 0),
          email: zodCompatibleEmail,
          inquiry_type: fc.constantFrom(...validInquiryTypes),
          message: validMessage
        }),
        (formData) => {
          const result = contactFormSchema.safeParse(formData)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues.some(issue => issue.path.includes('name'))).toBe(true)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should reject forms with whitespace-only message', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: validName,
          email: zodCompatibleEmail,
          inquiry_type: fc.constantFrom(...validInquiryTypes),
          message: fc.stringMatching(/^\s{10,}$/)
        }),
        (formData) => {
          const result = contactFormSchema.safeParse(formData)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues.some(issue => issue.path.includes('message'))).toBe(true)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should accept valid contact forms', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: validName,
          email: zodCompatibleEmail,
          inquiry_type: fc.constantFrom(...validInquiryTypes),
          message: validMessage,
          company: fc.option(fc.stringMatching(/^[a-zA-Z][a-zA-Z\s]{0,98}$/), { nil: undefined }),
          referral: fc.option(fc.stringMatching(/^[a-zA-Z][a-zA-Z\s]{0,198}$/), { nil: undefined })
        }),
        (formData) => {
          const result = contactFormSchema.safeParse(formData)
          expect(result.success).toBe(true)
        }
      ),
      { numRuns: 100 }
    )
  })
})
