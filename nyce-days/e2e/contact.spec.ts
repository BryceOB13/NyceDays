import { test, expect } from '@playwright/test'

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
  })

  test('contact page loads', async ({ page }) => {
    await expect(page).toHaveTitle(/Contact/)
    await expect(page.locator('form')).toBeVisible()
  })

  test('shows validation errors for empty submission', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]')
    
    // Should show validation errors
    await expect(page.locator('text=/required|invalid/i').first()).toBeVisible({ timeout: 5000 })
  })

  test('shows validation error for invalid email', async ({ page }) => {
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'invalid-email')
    await page.fill('textarea[name="message"]', 'Test message')
    
    await page.click('button[type="submit"]')
    
    // Should show email validation error
    await expect(page.locator('text=/email|invalid/i').first()).toBeVisible({ timeout: 5000 })
  })

  test('submits successfully with valid data', async ({ page }) => {
    // Fill out form
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'test@example.com')
    
    // Select inquiry type
    await page.click('[data-testid="inquiry-type"], [name="inquiry_type"], button:has-text("Select")')
    await page.click('text=General')
    
    await page.fill('textarea[name="message"]', 'This is a test message from Playwright E2E tests.')
    
    // Submit
    await page.click('button[type="submit"]')
    
    // Should show success message
    await expect(page.locator('text=/sent|success|thank/i').first()).toBeVisible({ timeout: 10000 })
  })
})
