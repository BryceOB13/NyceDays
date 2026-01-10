import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { contactFormSchema } from '../../lib/schemas'

// Custom email generator that produces emails Zod will accept
const zodCompatibleEmail = fc.tuple(
  fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9]{0,20}$/),
  fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9]{0,10}$/),
  fc.constantFrom('com', 'org', 'net', 'io', 'co')
).map(([local, domain, tld]) => `${local}@${domain}.${tld}`)

// Invalid email generator - strings that should fail validation
const invalidEmail = fc.oneof(
  // No @ symbol
  fc.string().filter(s => !s.includes('@') && s.length > 0),
  // @ but no domain
  fc.string().filter(s => s.length > 0 && !s.includes('@')).map(s => `${s}@`),
  // @ but invalid domain (no dot)
  fc.tuple(
    fc.string().filter(s => s.length > 0 && !s.includes('@')),
    fc.string().filter(s => s.length > 0 && !s.includes('.') && !s.includes('@'))
  ).map(([local, domain]) => `${local}@${domain}`),
  // Empty string
  fc.constant('')
)

const validInquiryTypes = ['partnership', 'event', 'content', 'general'] as const

// Non-whitespace string generator for valid names
const validName = fc.stringMatching(/^[a-zA-Z][a-zA-Z\s]{0,98}[a-zA-Z]$/).filter(s => s.trim().length > 0)

// Non-whitespace string generator for valid messages (at least 10 chars after trim)
const validMessage = fc.stringMatching(/^[a-zA-Z][a-zA-Z\s]{8,98}[a-zA-Z]$/).filter(s => s.trim().length >= 10)

// Valid contact form data generator
const validContactFormData = fc.record({
  name: validName,
  email: zodCompatibleEmail,
  inquiry_type: fc.constantFrom(...validInquiryTypes),
  message: validMessage,
  company: fc.option(fc.stringMatching(/^[a-zA-Z][a-zA-Z\s]{0,98}$/), { nil: undefined }),
  referral: fc.option(fc.stringMatching(/^[a-zA-Z][a-zA-Z\s]{0,198}$/), { nil: undefined })
})

/**
 * Feature: nyce-days-website, Property 8: Contact Submission Round-Trip
 * 
 * *For any* valid contact form data, submitting to the `/api/contact` endpoint and then
 * querying the `contact_submissions` table must return a record with matching name, email,
 * inquiry_type, and message.
 * 
 * Note: This property test validates the schema validation portion of the round-trip.
 * Full round-trip testing with database requires integration tests with a real Supabase instance.
 * 
 * **Validates: Requirements 8.4, 11.1**
 */
describe('Property 8: Contact Submission Round-Trip (Schema Validation)', () => {
  it('should accept any valid contact form data', () => {
    fc.assert(
      fc.property(
        validContactFormData,
        (contactData) => {
          const result = contactFormSchema.safeParse(contactData)
          expect(result.success).toBe(true)
          if (result.success) {
            expect(result.data.name).toBe(contactData.name)
            expect(result.data.email).toBe(contactData.email)
            expect(result.data.inquiry_type).toBe(contactData.inquiry_type)
            expect(result.data.message).toBe(contactData.message)
            if (contactData.company) {
              expect(result.data.company).toBe(contactData.company)
            }
            if (contactData.referral) {
              expect(result.data.referral).toBe(contactData.referral)
            }
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should preserve all required fields through schema parsing', () => {
    fc.assert(
      fc.property(
        validContactFormData,
        (contactData) => {
          const result = contactFormSchema.safeParse(contactData)
          expect(result.success).toBe(true)
          if (result.success) {
            // All required fields should be preserved exactly
            expect(result.data.name).toBe(contactData.name)
            expect(result.data.email).toBe(contactData.email)
            expect(result.data.inquiry_type).toBe(contactData.inquiry_type)
            expect(result.data.message).toBe(contactData.message)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should accept all valid inquiry type values', () => {
    fc.assert(
      fc.property(
        fc.tuple(validName, zodCompatibleEmail, fc.constantFrom(...validInquiryTypes), validMessage),
        ([name, email, inquiry_type, message]) => {
          const result = contactFormSchema.safeParse({ name, email, inquiry_type, message })
          expect(result.success).toBe(true)
          if (result.success) {
            expect(result.data.inquiry_type).toBe(inquiry_type)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should handle optional fields correctly', () => {
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
        (contactData) => {
          const result = contactFormSchema.safeParse(contactData)
          expect(result.success).toBe(true)
          if (result.success) {
            // Optional fields should be preserved if provided
            if (contactData.company !== undefined) {
              expect(result.data.company).toBe(contactData.company)
            }
            if (contactData.referral !== undefined) {
              expect(result.data.referral).toBe(contactData.referral)
            }
          }
        }
      ),
      { numRuns: 100 }
    )
  })
})

/**
 * Feature: nyce-days-website, Property 9: API Validation Error Response (contact)
 * 
 * *For any* invalid request body sent to `/api/contact`, the API must return
 * a 400 status code with a JSON body containing error details.
 * 
 * This property test validates that the schema correctly rejects invalid inputs
 * and provides appropriate error information.
 * 
 * **Validates: Requirements 11.4**
 */
describe('Property 9: API Validation Error Response (contact)', () => {
  it('should reject any invalid email format with error details', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: validName,
          email: invalidEmail,
          inquiry_type: fc.constantFrom(...validInquiryTypes),
          message: validMessage
        }),
        (contactData) => {
          const result = contactFormSchema.safeParse(contactData)
          expect(result.success).toBe(false)
          if (!result.success) {
            // Should have error details for the email field
            expect(result.error.issues.length).toBeGreaterThan(0)
            expect(result.error.issues.some(issue => 
              issue.path.includes('email')
            )).toBe(true)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should reject requests with missing required fields', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // Missing name
          fc.record({
            email: zodCompatibleEmail,
            inquiry_type: fc.constantFrom(...validInquiryTypes),
            message: validMessage
          }),
          // Missing email
          fc.record({
            name: validName,
            inquiry_type: fc.constantFrom(...validInquiryTypes),
            message: validMessage
          }),
          // Missing inquiry_type
          fc.record({
            name: validName,
            email: zodCompatibleEmail,
            message: validMessage
          }),
          // Missing message
          fc.record({
            name: validName,
            email: zodCompatibleEmail,
            inquiry_type: fc.constantFrom(...validInquiryTypes)
          })
        ),
        (incompleteData) => {
          const result = contactFormSchema.safeParse(incompleteData)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues.length).toBeGreaterThan(0)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should reject requests with invalid inquiry_type values', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: validName,
          email: zodCompatibleEmail,
          inquiry_type: fc.string().filter(s => 
            s.length > 0 && !validInquiryTypes.includes(s as any)
          ),
          message: validMessage
        }),
        (contactData) => {
          const result = contactFormSchema.safeParse(contactData)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues.some(issue => 
              issue.path.includes('inquiry_type')
            )).toBe(true)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should reject requests with message too short', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: validName,
          email: zodCompatibleEmail,
          inquiry_type: fc.constantFrom(...validInquiryTypes),
          message: fc.stringMatching(/^[a-zA-Z]{1,9}$/)
        }),
        (contactData) => {
          const result = contactFormSchema.safeParse(contactData)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues.some(issue => 
              issue.path.includes('message')
            )).toBe(true)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should reject requests with whitespace-only name', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.stringMatching(/^\s+$/).filter(s => s.length > 0),
          email: zodCompatibleEmail,
          inquiry_type: fc.constantFrom(...validInquiryTypes),
          message: validMessage
        }),
        (contactData) => {
          const result = contactFormSchema.safeParse(contactData)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues.some(issue => 
              issue.path.includes('name')
            )).toBe(true)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should reject requests with whitespace-only message', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: validName,
          email: zodCompatibleEmail,
          inquiry_type: fc.constantFrom(...validInquiryTypes),
          message: fc.stringMatching(/^\s{10,}$/)
        }),
        (contactData) => {
          const result = contactFormSchema.safeParse(contactData)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues.some(issue => 
              issue.path.includes('message')
            )).toBe(true)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should provide structured error information for all invalid inputs', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // Invalid email
          fc.record({
            name: validName,
            email: invalidEmail,
            inquiry_type: fc.constantFrom(...validInquiryTypes),
            message: validMessage
          }),
          // Invalid inquiry_type
          fc.record({
            name: validName,
            email: zodCompatibleEmail,
            inquiry_type: fc.string().filter(s => s.length > 0 && !validInquiryTypes.includes(s as any)),
            message: validMessage
          }),
          // Message too short
          fc.record({
            name: validName,
            email: zodCompatibleEmail,
            inquiry_type: fc.constantFrom(...validInquiryTypes),
            message: fc.stringMatching(/^[a-zA-Z]{1,9}$/)
          }),
          // Empty object
          fc.constant({})
        ),
        (invalidData) => {
          const result = contactFormSchema.safeParse(invalidData)
          expect(result.success).toBe(false)
          if (!result.success) {
            // Error should have issues array with at least one issue
            expect(Array.isArray(result.error.issues)).toBe(true)
            expect(result.error.issues.length).toBeGreaterThan(0)
            // Each issue should have a message
            result.error.issues.forEach(issue => {
              expect(typeof issue.message).toBe('string')
              expect(issue.message.length).toBeGreaterThan(0)
            })
          }
        }
      ),
      { numRuns: 100 }
    )
  })
})
