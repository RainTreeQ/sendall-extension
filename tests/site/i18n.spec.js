import { test, expect } from '@playwright/test';

test.describe('i18n Language Switching', () => {
  test('Should switch language to Chinese and update title/content', async ({ page }) => {
    await page.goto('/#/privacy');
    await expect(page.locator('h1')).toContainText('Privacy');

    // Select Chinese from language dropdown
    await page.selectOption('select[aria-label="Language"]', 'zh-CN');
    
    // Check if content updated
    await expect(page.locator('h1')).toContainText('隐私政策');
    await expect(page).toHaveTitle(/隐私政策/);
  });

  test('Should persist language across pages', async ({ page }) => {
    await page.goto('/#/faq');
    
    // Select Chinese from language dropdown
    await page.selectOption('select[aria-label="Language"]', 'zh-CN');
    await expect(page.locator('h1')).toContainText('常见问题');

    // Navigate to Contact
    await page.click('footer >> text=联系我们');
    
    // Should still be in Chinese
    await expect(page.locator('h1')).toContainText('联系我们');
  });
});