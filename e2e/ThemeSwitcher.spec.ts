import { test, expect } from '@playwright/test'

test.describe('Theme Switcher', () => {
  test('toggles theme and persists across navigation and page reload', async ({ page }) => {
    await page.goto('/')

    // Verify that the theme is light
    await expect(page.locator('html')).not.toHaveClass(/dark-theme/)

    const themeSwitcher = page.getByRole('button', { name: /☀️|🌙/ })
    await expect(themeSwitcher).toHaveText('☀️')

    await themeSwitcher.click()

    //  verify that the theme is changed to dark
    await expect(page.locator('html')).toHaveClass(/dark-theme/)
    await expect(themeSwitcher).toHaveText('🌙')

    await page.reload()

    // Verify that the theme is still dark
    await expect(page.locator('html')).toHaveClass(/dark-theme/)
    await expect(themeSwitcher).toHaveText('🌙')

    await themeSwitcher.click()

    // veriify that the theme is changed to light
    await expect(page.locator('html')).not.toHaveClass(/dark-theme/)
    await expect(themeSwitcher).toHaveText('☀️')
  })
})
