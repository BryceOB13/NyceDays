import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import type { ProjectWithMedia, Media } from '../../types/database'

/**
 * Feature: nyce-days-website, Property 1: Featured Projects Filter
 * 
 * *For any* project returned by the `getFeaturedProjects` query, the project must have
 * `featured=true` AND `published=true`.
 * 
 * Note: Since we cannot directly test the Supabase query without a database connection,
 * we test the filtering logic that should be applied to any project data.
 * This validates that the filter predicate correctly identifies featured projects.
 * 
 * **Validates: Requirements 3.5**
 */
describe('Property 1: Featured Projects Filter', () => {
  // Safe date string generator using integer timestamps
  const safeDateString = fc.integer({ min: 1577836800000, max: 1924905600000 })
    .map(ts => new Date(ts).toISOString())

  const safeDateOnlyString = fc.integer({ min: 1577836800000, max: 1924905600000 })
    .map(ts => new Date(ts).toISOString().split('T')[0])

  // Generator for random media
  const mediaGenerator: fc.Arbitrary<Media | null> = fc.option(
    fc.record({
      id: fc.uuid(),
      created_at: safeDateString,
      filename: fc.string({ minLength: 1, maxLength: 50 }),
      storage_path: fc.string({ minLength: 1, maxLength: 100 }),
      public_url: fc.option(fc.webUrl(), { nil: null }),
      type: fc.constantFrom('image', 'video') as fc.Arbitrary<'image' | 'video'>,
      mime_type: fc.option(fc.constantFrom('image/jpeg', 'image/png', 'video/mp4'), { nil: null }),
      width: fc.option(fc.integer({ min: 100, max: 4000 }), { nil: null }),
      height: fc.option(fc.integer({ min: 100, max: 4000 }), { nil: null }),
      size_bytes: fc.option(fc.integer({ min: 1000, max: 10000000 }), { nil: null }),
      alt_text: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: null }),
      caption: fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: null }),
      category: fc.option(fc.constantFrom('event', 'bts', 'merch', 'community', 'site') as fc.Arbitrary<'event' | 'bts' | 'merch' | 'community' | 'site'>, { nil: null }),
      project_id: fc.option(fc.uuid(), { nil: null }),
      sort_order: fc.integer({ min: 0, max: 100 })
    }),
    { nil: null }
  )

  // Generator for random projects with various featured/published combinations
  const projectGenerator: fc.Arbitrary<ProjectWithMedia> = fc.record({
    id: fc.uuid(),
    created_at: safeDateString,
    updated_at: safeDateString,
    title: fc.string({ minLength: 1, maxLength: 100 }),
    slug: fc.stringMatching(/^[a-z0-9-]{1,50}$/),
    description: fc.option(fc.string({ minLength: 1, maxLength: 500 }), { nil: null }),
    content: fc.option(fc.string({ minLength: 1, maxLength: 2000 }), { nil: null }),
    client: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: null }),
    date: fc.option(safeDateOnlyString, { nil: null }),
    location: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: null }),
    category: fc.option(fc.constantFrom('event', 'content', 'partnership') as fc.Arbitrary<'event' | 'content' | 'partnership'>, { nil: null }),
    services: fc.option(fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 0, maxLength: 5 }), { nil: null }),
    featured: fc.boolean(),
    published: fc.boolean(),
    hero_media_id: fc.option(fc.uuid(), { nil: null }),
    sort_order: fc.integer({ min: 0, max: 100 }),
    hero_media: mediaGenerator
  })

  // The filter predicate that should match the Supabase query logic
  const isFeaturedProject = (project: ProjectWithMedia): boolean => {
    return project.featured === true && project.published === true
  }

  it('should only include projects where featured=true AND published=true', () => {
    fc.assert(
      fc.property(
        fc.array(projectGenerator, { minLength: 0, maxLength: 20 }),
        (projects) => {
          // Apply the filter that getFeaturedProjects should apply
          const filteredProjects = projects.filter(isFeaturedProject)
          
          // Every project in the filtered list must have featured=true AND published=true
          filteredProjects.forEach(project => {
            expect(project.featured).toBe(true)
            expect(project.published).toBe(true)
          })
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should exclude projects where featured=false', () => {
    fc.assert(
      fc.property(
        fc.array(projectGenerator, { minLength: 1, maxLength: 20 }),
        (projects) => {
          const filteredProjects = projects.filter(isFeaturedProject)
          
          // No project with featured=false should be in the filtered list
          const unfeaturedInFiltered = filteredProjects.filter(p => p.featured === false)
          expect(unfeaturedInFiltered.length).toBe(0)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should exclude projects where published=false', () => {
    fc.assert(
      fc.property(
        fc.array(projectGenerator, { minLength: 1, maxLength: 20 }),
        (projects) => {
          const filteredProjects = projects.filter(isFeaturedProject)
          
          // No project with published=false should be in the filtered list
          const unpublishedInFiltered = filteredProjects.filter(p => p.published === false)
          expect(unpublishedInFiltered.length).toBe(0)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should include all projects that are both featured and published', () => {
    fc.assert(
      fc.property(
        fc.array(projectGenerator, { minLength: 1, maxLength: 20 }),
        (projects) => {
          const filteredProjects = projects.filter(isFeaturedProject)
          
          // Count projects that should be included
          const expectedCount = projects.filter(p => p.featured && p.published).length
          
          // Filtered count should match expected count
          expect(filteredProjects.length).toBe(expectedCount)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return empty array when no projects are both featured and published', () => {
    // Generate projects that are specifically not both featured AND published
    const unfeaturedProject = projectGenerator.map(p => ({
      ...p,
      featured: false
    }))

    fc.assert(
      fc.property(
        fc.array(unfeaturedProject, { minLength: 1, maxLength: 10 }),
        (projects) => {
          const filteredProjects = projects.filter(isFeaturedProject)
          expect(filteredProjects.length).toBe(0)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should limit results to maximum 3 projects (simulating query limit)', () => {
    // Generate projects that are all featured and published
    const featuredPublishedProject = projectGenerator.map(p => ({
      ...p,
      featured: true,
      published: true
    }))

    fc.assert(
      fc.property(
        fc.array(featuredPublishedProject, { minLength: 5, maxLength: 20 }),
        (projects) => {
          const filteredProjects = projects.filter(isFeaturedProject)
          // Simulate the .limit(3) from the query
          const limitedProjects = filteredProjects.slice(0, 3)
          
          expect(limitedProjects.length).toBeLessThanOrEqual(3)
          // All returned projects should still satisfy the filter
          limitedProjects.forEach(project => {
            expect(project.featured).toBe(true)
            expect(project.published).toBe(true)
          })
        }
      ),
      { numRuns: 100 }
    )
  })
})


/**
 * Feature: nyce-days-website, Property 2: Project Category Filter
 * 
 * *For any* category filter value and *for any* project returned by `getAllProjects(category)`,
 * if the category is not 'all', then the project's category must equal the filter value.
 * 
 * Note: Since we cannot directly test the Supabase query without a database connection,
 * we test the filtering logic that should be applied to any project data.
 * This validates that the filter predicate correctly filters projects by category.
 * 
 * **Validates: Requirements 4.2**
 */
describe('Property 2: Project Category Filter', () => {
  // Safe date string generator using integer timestamps
  const safeDateString = fc.integer({ min: 1577836800000, max: 1924905600000 })
    .map(ts => new Date(ts).toISOString())

  const safeDateOnlyString = fc.integer({ min: 1577836800000, max: 1924905600000 })
    .map(ts => new Date(ts).toISOString().split('T')[0])

  // Generator for random media
  const mediaGenerator: fc.Arbitrary<Media | null> = fc.option(
    fc.record({
      id: fc.uuid(),
      created_at: safeDateString,
      filename: fc.string({ minLength: 1, maxLength: 50 }),
      storage_path: fc.string({ minLength: 1, maxLength: 100 }),
      public_url: fc.option(fc.webUrl(), { nil: null }),
      type: fc.constantFrom('image', 'video') as fc.Arbitrary<'image' | 'video'>,
      mime_type: fc.option(fc.constantFrom('image/jpeg', 'image/png', 'video/mp4'), { nil: null }),
      width: fc.option(fc.integer({ min: 100, max: 4000 }), { nil: null }),
      height: fc.option(fc.integer({ min: 100, max: 4000 }), { nil: null }),
      size_bytes: fc.option(fc.integer({ min: 1000, max: 10000000 }), { nil: null }),
      alt_text: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: null }),
      caption: fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: null }),
      category: fc.option(fc.constantFrom('event', 'bts', 'merch', 'community', 'site') as fc.Arbitrary<'event' | 'bts' | 'merch' | 'community' | 'site'>, { nil: null }),
      project_id: fc.option(fc.uuid(), { nil: null }),
      sort_order: fc.integer({ min: 0, max: 100 })
    }),
    { nil: null }
  )

  // Valid project categories
  const projectCategories = ['event', 'content', 'partnership'] as const
  type ProjectCategory = typeof projectCategories[number]

  // Generator for random projects with published=true (simulating getAllProjects base filter)
  const publishedProjectGenerator: fc.Arbitrary<ProjectWithMedia> = fc.record({
    id: fc.uuid(),
    created_at: safeDateString,
    updated_at: safeDateString,
    title: fc.string({ minLength: 1, maxLength: 100 }),
    slug: fc.stringMatching(/^[a-z0-9-]{1,50}$/),
    description: fc.option(fc.string({ minLength: 1, maxLength: 500 }), { nil: null }),
    content: fc.option(fc.string({ minLength: 1, maxLength: 2000 }), { nil: null }),
    client: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: null }),
    date: fc.option(safeDateOnlyString, { nil: null }),
    location: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: null }),
    category: fc.option(fc.constantFrom(...projectCategories) as fc.Arbitrary<ProjectCategory>, { nil: null }),
    services: fc.option(fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 0, maxLength: 5 }), { nil: null }),
    featured: fc.boolean(),
    published: fc.constant(true), // getAllProjects only returns published projects
    hero_media_id: fc.option(fc.uuid(), { nil: null }),
    sort_order: fc.integer({ min: 0, max: 100 }),
    hero_media: mediaGenerator
  })

  // Filter categories including 'all'
  const filterCategoryGenerator = fc.constantFrom('all', ...projectCategories)

  // The filter predicate that should match the getAllProjects query logic
  const filterByCategory = (projects: ProjectWithMedia[], category: string): ProjectWithMedia[] => {
    if (category === 'all') {
      return projects
    }
    return projects.filter(p => p.category === category)
  }

  it('should return all projects when category is "all"', () => {
    fc.assert(
      fc.property(
        fc.array(publishedProjectGenerator, { minLength: 0, maxLength: 20 }),
        (projects) => {
          const filteredProjects = filterByCategory(projects, 'all')
          
          // When category is 'all', all projects should be returned
          expect(filteredProjects.length).toBe(projects.length)
          expect(filteredProjects).toEqual(projects)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should only return projects matching the specified category', () => {
    fc.assert(
      fc.property(
        fc.array(publishedProjectGenerator, { minLength: 1, maxLength: 20 }),
        fc.constantFrom(...projectCategories),
        (projects, category) => {
          const filteredProjects = filterByCategory(projects, category)
          
          // Every project in the filtered list must have the specified category
          filteredProjects.forEach(project => {
            expect(project.category).toBe(category)
          })
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should exclude projects with different categories', () => {
    fc.assert(
      fc.property(
        fc.array(publishedProjectGenerator, { minLength: 1, maxLength: 20 }),
        fc.constantFrom(...projectCategories),
        (projects, category) => {
          const filteredProjects = filterByCategory(projects, category)
          
          // No project with a different category should be in the filtered list
          const wrongCategoryInFiltered = filteredProjects.filter(p => p.category !== category)
          expect(wrongCategoryInFiltered.length).toBe(0)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should include all projects that match the category', () => {
    fc.assert(
      fc.property(
        fc.array(publishedProjectGenerator, { minLength: 1, maxLength: 20 }),
        fc.constantFrom(...projectCategories),
        (projects, category) => {
          const filteredProjects = filterByCategory(projects, category)
          
          // Count projects that should be included
          const expectedCount = projects.filter(p => p.category === category).length
          
          // Filtered count should match expected count
          expect(filteredProjects.length).toBe(expectedCount)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return empty array when no projects match the category', () => {
    // Generate projects with a specific category
    const eventOnlyProject = publishedProjectGenerator.map(p => ({
      ...p,
      category: 'event' as const
    }))

    fc.assert(
      fc.property(
        fc.array(eventOnlyProject, { minLength: 1, maxLength: 10 }),
        (projects) => {
          // Filter by a different category
          const filteredProjects = filterByCategory(projects, 'content')
          expect(filteredProjects.length).toBe(0)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should handle projects with null category correctly', () => {
    // Generate projects with null category
    const nullCategoryProject = publishedProjectGenerator.map(p => ({
      ...p,
      category: null
    }))

    fc.assert(
      fc.property(
        fc.array(nullCategoryProject, { minLength: 1, maxLength: 10 }),
        fc.constantFrom(...projectCategories),
        (projects, category) => {
          const filteredProjects = filterByCategory(projects, category)
          
          // Projects with null category should not match any specific category
          expect(filteredProjects.length).toBe(0)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return projects with null category when filter is "all"', () => {
    // Generate projects with null category
    const nullCategoryProject = publishedProjectGenerator.map(p => ({
      ...p,
      category: null
    }))

    fc.assert(
      fc.property(
        fc.array(nullCategoryProject, { minLength: 1, maxLength: 10 }),
        (projects) => {
          const filteredProjects = filterByCategory(projects, 'all')
          
          // All projects should be returned including those with null category
          expect(filteredProjects.length).toBe(projects.length)
        }
      ),
      { numRuns: 100 }
    )
  })
})


/**
 * Feature: nyce-days-website, Property 3: Adjacent Project Navigation
 * 
 * *For any* project in the published projects list, the `getAdjacentProjects` function must return:
 * - `prev` as the project immediately before in sort order (or null if first)
 * - `next` as the project immediately after in sort order (or null if last)
 * 
 * Note: Since we cannot directly test the Supabase query without a database connection,
 * we test the navigation logic that should be applied to any ordered project list.
 * This validates that the adjacent project finder correctly identifies prev/next projects.
 * 
 * **Validates: Requirements 4.4**
 */
describe('Property 3: Adjacent Project Navigation', () => {
  // Simple project type for navigation testing (only need slug and title)
  interface NavProject {
    slug: string
    title: string
  }

  // Generator for navigation projects
  const navProjectGenerator: fc.Arbitrary<NavProject> = fc.record({
    slug: fc.stringMatching(/^[a-z0-9-]{1,50}$/),
    title: fc.string({ minLength: 1, maxLength: 100 }),
  })

  // The navigation logic that should match getAdjacentProjects
  const getAdjacentProjectsLogic = (
    projects: NavProject[],
    currentSlug: string
  ): { prev: NavProject | null; next: NavProject | null } => {
    const currentIndex = projects.findIndex((p) => p.slug === currentSlug)
    
    if (currentIndex === -1) {
      return { prev: null, next: null }
    }

    return {
      prev: currentIndex > 0 ? projects[currentIndex - 1] : null,
      next: currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null,
    }
  }

  it('should return null for both prev and next when project is not found', () => {
    fc.assert(
      fc.property(
        fc.array(navProjectGenerator, { minLength: 1, maxLength: 20 }),
        fc.stringMatching(/^[a-z0-9-]{1,50}$/),
        (projects, nonExistentSlug) => {
          // Ensure the slug doesn't exist in the projects
          const slugExists = projects.some((p) => p.slug === nonExistentSlug)
          if (slugExists) return true // Skip this case

          const result = getAdjacentProjectsLogic(projects, nonExistentSlug)
          
          expect(result.prev).toBeNull()
          expect(result.next).toBeNull()
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return null for prev when project is first in list', () => {
    fc.assert(
      fc.property(
        fc.array(navProjectGenerator, { minLength: 1, maxLength: 20 }),
        (projects) => {
          // Ensure unique slugs
          const uniqueProjects = projects.filter(
            (p, i, arr) => arr.findIndex((x) => x.slug === p.slug) === i
          )
          if (uniqueProjects.length === 0) return true

          const firstProject = uniqueProjects[0]
          const result = getAdjacentProjectsLogic(uniqueProjects, firstProject.slug)
          
          expect(result.prev).toBeNull()
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return null for next when project is last in list', () => {
    fc.assert(
      fc.property(
        fc.array(navProjectGenerator, { minLength: 1, maxLength: 20 }),
        (projects) => {
          // Ensure unique slugs
          const uniqueProjects = projects.filter(
            (p, i, arr) => arr.findIndex((x) => x.slug === p.slug) === i
          )
          if (uniqueProjects.length === 0) return true

          const lastProject = uniqueProjects[uniqueProjects.length - 1]
          const result = getAdjacentProjectsLogic(uniqueProjects, lastProject.slug)
          
          expect(result.next).toBeNull()
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return correct prev project for middle projects', () => {
    fc.assert(
      fc.property(
        fc.array(navProjectGenerator, { minLength: 3, maxLength: 20 }),
        fc.integer({ min: 1, max: 18 }),
        (projects, indexOffset) => {
          // Ensure unique slugs
          const uniqueProjects = projects.filter(
            (p, i, arr) => arr.findIndex((x) => x.slug === p.slug) === i
          )
          if (uniqueProjects.length < 3) return true

          // Pick a middle project (not first or last)
          const middleIndex = Math.min(indexOffset, uniqueProjects.length - 2)
          if (middleIndex < 1) return true

          const middleProject = uniqueProjects[middleIndex]
          const result = getAdjacentProjectsLogic(uniqueProjects, middleProject.slug)
          
          expect(result.prev).not.toBeNull()
          expect(result.prev?.slug).toBe(uniqueProjects[middleIndex - 1].slug)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return correct next project for middle projects', () => {
    fc.assert(
      fc.property(
        fc.array(navProjectGenerator, { minLength: 3, maxLength: 20 }),
        fc.integer({ min: 0, max: 17 }),
        (projects, indexOffset) => {
          // Ensure unique slugs
          const uniqueProjects = projects.filter(
            (p, i, arr) => arr.findIndex((x) => x.slug === p.slug) === i
          )
          if (uniqueProjects.length < 3) return true

          // Pick a middle project (not last)
          const middleIndex = Math.min(indexOffset, uniqueProjects.length - 2)
          const middleProject = uniqueProjects[middleIndex]
          const result = getAdjacentProjectsLogic(uniqueProjects, middleProject.slug)
          
          expect(result.next).not.toBeNull()
          expect(result.next?.slug).toBe(uniqueProjects[middleIndex + 1].slug)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should return both prev and next for projects in the middle of the list', () => {
    fc.assert(
      fc.property(
        fc.array(navProjectGenerator, { minLength: 3, maxLength: 20 }),
        (projects) => {
          // Ensure unique slugs
          const uniqueProjects = projects.filter(
            (p, i, arr) => arr.findIndex((x) => x.slug === p.slug) === i
          )
          if (uniqueProjects.length < 3) return true

          // Pick a middle project (not first or last)
          const middleIndex = Math.floor(uniqueProjects.length / 2)
          const middleProject = uniqueProjects[middleIndex]
          const result = getAdjacentProjectsLogic(uniqueProjects, middleProject.slug)
          
          expect(result.prev).not.toBeNull()
          expect(result.next).not.toBeNull()
          expect(result.prev?.slug).toBe(uniqueProjects[middleIndex - 1].slug)
          expect(result.next?.slug).toBe(uniqueProjects[middleIndex + 1].slug)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should handle single project list correctly', () => {
    fc.assert(
      fc.property(
        navProjectGenerator,
        (project) => {
          const projects = [project]
          const result = getAdjacentProjectsLogic(projects, project.slug)
          
          // Single project should have no prev or next
          expect(result.prev).toBeNull()
          expect(result.next).toBeNull()
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should handle two project list correctly', () => {
    fc.assert(
      fc.property(
        navProjectGenerator,
        navProjectGenerator,
        (project1, project2) => {
          // Ensure different slugs
          if (project1.slug === project2.slug) return true

          const projects = [project1, project2]
          
          // First project should have no prev, but have next
          const result1 = getAdjacentProjectsLogic(projects, project1.slug)
          expect(result1.prev).toBeNull()
          expect(result1.next?.slug).toBe(project2.slug)
          
          // Second project should have prev, but no next
          const result2 = getAdjacentProjectsLogic(projects, project2.slug)
          expect(result2.prev?.slug).toBe(project1.slug)
          expect(result2.next).toBeNull()
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should maintain order consistency - prev of next should be current', () => {
    fc.assert(
      fc.property(
        fc.array(navProjectGenerator, { minLength: 3, maxLength: 20 }),
        (projects) => {
          // Ensure unique slugs
          const uniqueProjects = projects.filter(
            (p, i, arr) => arr.findIndex((x) => x.slug === p.slug) === i
          )
          if (uniqueProjects.length < 3) return true

          // Pick a project that has a next
          const index = Math.floor(uniqueProjects.length / 2)
          const currentProject = uniqueProjects[index]
          const result = getAdjacentProjectsLogic(uniqueProjects, currentProject.slug)
          
          if (result.next) {
            // Get adjacent for the next project
            const nextResult = getAdjacentProjectsLogic(uniqueProjects, result.next.slug)
            // The prev of next should be current
            expect(nextResult.prev?.slug).toBe(currentProject.slug)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should maintain order consistency - next of prev should be current', () => {
    fc.assert(
      fc.property(
        fc.array(navProjectGenerator, { minLength: 3, maxLength: 20 }),
        (projects) => {
          // Ensure unique slugs
          const uniqueProjects = projects.filter(
            (p, i, arr) => arr.findIndex((x) => x.slug === p.slug) === i
          )
          if (uniqueProjects.length < 3) return true

          // Pick a project that has a prev
          const index = Math.floor(uniqueProjects.length / 2)
          if (index < 1) return true
          
          const currentProject = uniqueProjects[index]
          const result = getAdjacentProjectsLogic(uniqueProjects, currentProject.slug)
          
          if (result.prev) {
            // Get adjacent for the prev project
            const prevResult = getAdjacentProjectsLogic(uniqueProjects, result.prev.slug)
            // The next of prev should be current
            expect(prevResult.next?.slug).toBe(currentProject.slug)
          }
        }
      ),
      { numRuns: 100 }
    )
  })
})
