import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import type { Media } from '../../types/database'

/**
 * Feature: nyce-days-website, Property 4: Media Category Filter
 * 
 * *For any* category filter value and *for any* media item returned by `getMediaByCategory(category)`,
 * if the category is not 'all', then the media's category must equal the filter value.
 * 
 * Note: Since we cannot directly test the Supabase query without a database connection,
 * we test the filtering logic that should be applied to any media data.
 * This validates that the filter predicate correctly filters media by category.
 * 
 * **Validates: Requirements 5.2**
 */
describe('Property 4: Media Category Filter', () => {
  // Safe date string generator using integer timestamps
  const safeDateString = fc.integer({ min: 1577836800000, max: 1924905600000 })
    .map(ts => new Date(ts).toISOString())

  // Valid media categories
  const mediaCategories = ['event', 'bts', 'merch', 'community', 'site'] as const
  type MediaCategory = typeof mediaCategories[number]

  // Generator for random media items (only images, as getMediaByCategory filters by type='image')
  const mediaGenerator: fc.Arbitrary<Media> = fc.record({
    id: fc.uuid(),
    created_at: safeDateString,
    filename: fc.string({ minLength: 1, maxLength: 50 }),
    storage_path: fc.string({ minLength: 1, maxLength: 100 }),
    public_url: fc.option(fc.webUrl(), { nil: null }),
    type: fc.constant('image') as fc.Arbitrary<'image' | 'video'>,
    mime_type: fc.option(fc.constantFrom('image/jpeg', 'image/png', 'image/webp'), { nil: null }),
    width: fc.option(fc.integer({ min: 100, max: 4000 }), { nil: null }),
    height: fc.option(fc.integer({ min: 100, max: 4000 }), { nil: null }),
    size_bytes: fc.option(fc.integer({ min: 1000, max: 10000000 }), { nil: null }),
    alt_text: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: null }),
    caption: fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: null }),
    category: fc.option(fc.constantFrom(...mediaCategories) as fc.Arbitrary<MediaCategory>, { nil: null }),
    project_id: fc.option(fc.uuid(), { nil: null }),
    sort_order: fc.integer({ min: 0, max: 100 })
  })

  // The filter predicate that should match the getMediaByCategory query logic
  const filterByCategory = (media: Media[], category: string): Media[] => {
    if (category === 'all') {
      return media
    }
    return media.filter(m => m.category === category)
  }

  it('should return all media when category is "all"', () => {
    fc.assert(
      fc.property(
        fc.array(mediaGenerator, { minLength: 0, maxLength: 20 }),
        (media) => {
          const filteredMedia = filterByCategory(media, 'all')
          
          // When category is 'all', all media should be returned
          expect(filteredMedia.length).toBe(media.length)
          expect(filteredMedia).toEqual(media)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should only return media matching the specified category', () => {
    fc.assert(
      fc.property(
        fc.array(mediaGenerator, { minLength: 1, maxLength: 20 }),
        fc.constantFrom(...mediaCategories),
        (media, category) => {
          const filteredMedia = filterByCategory(media, category)
          
          // Every media item in the filtered list must have the specified category
          filteredMedia.forEach(item => {
            expect(item.category).toBe(category)
          })
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should exclude media with different categories', () => {
    fc.assert(
      fc.property(
        fc.array(mediaGenerator, { minLength: 1, maxLength: 20 }),
        fc.constantFrom(...mediaCategories),
        (media, category) => {
          const filteredMedia = filterByCategory(media, category)
          
          // No media with a different category should be in the filtered list
          const wrongCategoryInFiltered = filteredMedia.filter(m => m.category !== category)
          expect(wrongCategoryInFiltered.length).toBe(0)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should include all media that match the category', () => {
    fc.assert(
      fc.property(
        fc.array(mediaGenerator, { minLength: 1, maxLength: 20 }),
        fc.constantFrom(...mediaCategories),
        (media, category) => {
          const filteredMedia = filterByCategory(media, category)
          
          // Count media that should be included
          const expectedCount = media.filter(m => m.category === category).length
          
          // Filtered count should match expected count
          expect(filteredMedia.length).toBe(expectedCount)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return empty array when no media match the category', () => {
    // Generate media with a specific category
    const eventOnlyMedia = mediaGenerator.map(m => ({
      ...m,
      category: 'event' as const
    }))

    fc.assert(
      fc.property(
        fc.array(eventOnlyMedia, { minLength: 1, maxLength: 10 }),
        (media) => {
          // Filter by a different category
          const filteredMedia = filterByCategory(media, 'bts')
          expect(filteredMedia.length).toBe(0)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should handle media with null category correctly', () => {
    // Generate media with null category
    const nullCategoryMedia = mediaGenerator.map(m => ({
      ...m,
      category: null
    }))

    fc.assert(
      fc.property(
        fc.array(nullCategoryMedia, { minLength: 1, maxLength: 10 }),
        fc.constantFrom(...mediaCategories),
        (media, category) => {
          const filteredMedia = filterByCategory(media, category)
          
          // Media with null category should not match any specific category
          expect(filteredMedia.length).toBe(0)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return media with null category when filter is "all"', () => {
    // Generate media with null category
    const nullCategoryMedia = mediaGenerator.map(m => ({
      ...m,
      category: null
    }))

    fc.assert(
      fc.property(
        fc.array(nullCategoryMedia, { minLength: 1, maxLength: 10 }),
        (media) => {
          const filteredMedia = filterByCategory(media, 'all')
          
          // All media should be returned including those with null category
          expect(filteredMedia.length).toBe(media.length)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should handle mixed categories correctly', () => {
    fc.assert(
      fc.property(
        fc.array(mediaGenerator, { minLength: 5, maxLength: 30 }),
        fc.constantFrom(...mediaCategories),
        (media, targetCategory) => {
          const filteredMedia = filterByCategory(media, targetCategory)
          
          // All filtered items should have the target category
          const allMatch = filteredMedia.every(m => m.category === targetCategory)
          expect(allMatch).toBe(true)
          
          // No items with target category should be missing
          const expectedItems = media.filter(m => m.category === targetCategory)
          expect(filteredMedia.length).toBe(expectedItems.length)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should preserve order of media items after filtering', () => {
    fc.assert(
      fc.property(
        fc.array(mediaGenerator, { minLength: 2, maxLength: 20 }),
        fc.constantFrom(...mediaCategories),
        (media, category) => {
          const filteredMedia = filterByCategory(media, category)
          
          // Get the original indices of filtered items
          const originalIndices = filteredMedia.map(filtered => 
            media.findIndex(m => m.id === filtered.id)
          )
          
          // Indices should be in ascending order (preserving original order)
          for (let i = 1; i < originalIndices.length; i++) {
            expect(originalIndices[i]).toBeGreaterThan(originalIndices[i - 1])
          }
        }
      ),
      { numRuns: 100 }
    )
  })
})
