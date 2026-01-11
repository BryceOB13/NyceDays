import { test, expect } from '@playwright/test'

test.describe('Newsletter Subscription', () => {
  test('subscribes from community page', async ({ page }) => {
    await page.goto('/community')
    
    // Find newsletter form
    const emailInput = page.locator('input[type="email"]').first()
    await expect(emailInput).toBeVisible()
    
    // Fill and submit
    await emailInput.fill('test-newsletter@example.com')
    await page.click('button:has-text("Subscribe")')
    
    // Should show success
    await expect(page.locator('text=/thank|success|subscribed/i').first()).toBeVisible({ timeout: 10000 })
  })

  test('shows error for invalid email', async ({ page }) => {
    await page.goto('/community')
    
    const emailInput = page.locator('input[type="email"]').first()
    await emailInput.fill('invalid-email')
    await page.click('button:has-text("Subscribe")')
    
    // Should show error
    await expect(page.locator('text=/invalid|error/i').first()).toBeVisible({ timeout: 5000 })
  })
})
