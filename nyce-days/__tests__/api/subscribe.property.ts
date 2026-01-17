import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { subscribeSchema } from '../../lib/schemas'

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

const validSources = ['footer', 'community', 'shop', 'contact'] as const

/**
 * Feature: nyce-days-website, Property 7: Newsletter Subscription Round-Trip
 * 
 * *For any* valid email address, submitting to the `/api/subscribe` endpoint and then
 * querying the `subscribers` table must return a record with that email and `subscribed=true`.
 * 
 * Note: This property test validates the schema validation portion of the round-trip.
 * Full round-trip testing with database requires integration tests with a real Supabase instance.
 * 
 * **Validates: Requirements 6.5, 11.2**
 */
describe('Property 7: Newsletter Subscription Round-Trip (Schema Validation)', () => {
  it('should accept any valid email with optional source for subscription', () => {
    fc.assert(
      fc.property(
        fc.record({
          email: zodCompatibleEmail,
          source: fc.option(fc.constantFrom(...validSources), { nil: undefined })
        }),
        (subscribeData) => {
          const result = subscribeSchema.safeParse(subscribeData)
          expect(result.success).toBe(true)
          if (result.success) {
            expect(result.data.email).toBe(subscribeData.email)
            if (subscribeData.source) {
              expect(result.data.source).toBe(subscribeData.source)
            }
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should preserve email format through schema parsing', () => {
    fc.assert(
      fc.property(
        zodCompatibleEmail,
        (email) => {
          const result = subscribeSchema.safeParse({ email })
          expect(result.success).toBe(true)
          if (result.success) {
            // Email should be preserved exactly as input
            expect(result.data.email).toBe(email)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should accept all valid source values', () => {
    fc.assert(
      fc.property(
        fc.tuple(zodCompatibleEmail, fc.constantFrom(...validSources)),
        ([email, source]) => {
          const result = subscribeSchema.safeParse({ email, source })
          expect(result.success).toBe(true)
          if (result.success) {
            expect(result.data.source).toBe(source)
          }
        }
      ),
      { numRuns: 100 }
    )
  })
})

/**
 * Feature: nyce-days-website, Property 9: API Validation Error Response (subscribe)
 * 
 * *For any* invalid request body sent to `/api/subscribe`, the API must return
 * a 400 status code with a JSON body containing error details.
 * 
 * This property test validates that the schema correctly rejects invalid inputs
 * and provides appropriate error information.
 * 
 * **Validates: Requirements 11.4**
 */
describe('Property 9: API Validation Error Response (subscribe)', () => {
  it('should reject any invalid email format with error details', () => {
    fc.assert(
      fc.property(
        invalidEmail,
        (email) => {
          const result = subscribeSchema.safeParse({ email })
          expect(result.success).toBe(false)
          if (!result.success) {
            // Should have error details for the email field
            expect(result.error.issues.length).toBeGreaterThan(0)
            expect(result.error.issues.some(issue => 
              issue.path.includes('email') || issue.path.length === 0
            )).toBe(true)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should reject requests with missing email field', () => {
    fc.assert(
      fc.property(
        fc.record({
          source: fc.option(fc.constantFrom(...validSources), { nil: undefined })
        }),
        (data) => {
          const result = subscribeSchema.safeParse(data)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues.some(issue => 
              issue.path.includes('email')
            )).toBe(true)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should reject requests with invalid source values', () => {
    fc.assert(
      fc.property(
        fc.record({
          email: zodCompatibleEmail,
          source: fc.string().filter(s => 
            s.length > 0 && !(validSources as readonly string[]).includes(s)
          )
        }),
        (data) => {
          const result = subscribeSchema.safeParse(data)
          expect(result.success).toBe(false)
          if (!result.success) {
            expect(result.error.issues.some(issue => 
              issue.path.includes('source')
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
          fc.record({ email: invalidEmail }),
          // Missing email entirely
          fc.record({ source: fc.constantFrom(...validSources) }),
          // Invalid source with valid email
          fc.record({
            email: zodCompatibleEmail,
            source: fc.string().filter(s => s.length > 0 && !(validSources as readonly string[]).includes(s))
          }),
          // Empty object
          fc.constant({})
        ),
        (invalidData) => {
          const result = subscribeSchema.safeParse(invalidData)
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
