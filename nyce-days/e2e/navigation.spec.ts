import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Nyce Days/)
    await expect(page.locator('nav')).toBeVisible()
  })

  test('navigation links work', async ({ page }) => {
    await page.goto('/')
    
    // Test portfolio link
    await page.click('a[href="/portfolio"]')
    await expect(page).toHaveURL(/portfolio/)
    
    // Test about link
    await page.click('a[href="/about"]')
    await expect(page).toHaveURL(/about/)
    
    // Test contact link
    await page.click('a[href="/contact"]')
    await expect(page).toHaveURL(/contact/)
  })

  test('mobile navigation works', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Open mobile menu
    await page.click('button[aria-label="Open menu"]')
    
    // Check menu is visible
    await expect(page.locator('text=Home')).toBeVisible()
    await expect(page.locator('text=Portfolio')).toBeVisible()
    
    // Close menu
    await page.click('button[aria-label="Close menu"]')
  })

  test('footer links are present', async ({ page }) => {
    await page.goto('/')
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    
    // Check footer content
    await expect(page.locator('footer')).toBeVisible()
    await expect(page.locator('footer >> text=Washington DC')).toBeVisible()
  })
})
