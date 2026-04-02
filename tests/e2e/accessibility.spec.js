// @ts-check
const { test, expect } = require('@playwright/test');

const TEST_URL = '/tests/e2e/fixtures/test-page.html';

/**
 * Wait for the plugin to fully initialize
 */
async function waitForInit(page) {
  await page.goto(TEST_URL);
  await page.waitForSelector('.vs-initialized', { timeout: 10000 });
}

/**
 * Wait for scroll animation to complete
 */
async function waitForScrollComplete(page) {
  await page.waitForTimeout(500);
}

test.describe('ARIA roles on container and sections', () => {
  test('container has region role and aria-label', async ({ page }) => {
    await waitForInit(page);

    const container = page.locator('#scroll-container');
    await expect(container).toHaveAttribute('role', 'region');
    await expect(container).toHaveAttribute('aria-label', 'Vertical scrolling content');
  });

  test('sections have group role and aria-label', async ({ page }) => {
    await waitForInit(page);

    // Each section should have role="group"
    const sections = page.locator('.vs-section');
    const count = await sections.count();
    expect(count).toBe(5);

    for (let i = 0; i < count; i++) {
      const section = sections.nth(i);
      await expect(section).toHaveAttribute('role', 'group');
    }

    // Sections with data-vs-label should use that as aria-label
    await expect(page.locator('#section-1')).toHaveAttribute('aria-label', 'Home');
    await expect(page.locator('#section-2')).toHaveAttribute('aria-label', 'About');
    await expect(page.locator('#section-3')).toHaveAttribute('aria-label', 'Services');
    await expect(page.locator('#section-4')).toHaveAttribute('aria-label', 'Portfolio');
    await expect(page.locator('#section-5')).toHaveAttribute('aria-label', 'Contact');
  });
});

test.describe('Pagination ARIA attributes', () => {
  test('pagination nav has navigation role and aria-label', async ({ page }) => {
    await waitForInit(page);

    const pagination = page.locator('.vs-pagination');
    await expect(pagination).toHaveAttribute('role', 'navigation');
    await expect(pagination).toHaveAttribute('aria-label', 'Section navigation');
  });

  test('pagination buttons have aria-label', async ({ page }) => {
    await waitForInit(page);

    // Each pagination button should have an aria-label derived from data-vs-label
    await expect(page.locator('.vs-pagination-button[data-vs-target="0"]'))
      .toHaveAttribute('aria-label', 'Go to Home');
    await expect(page.locator('.vs-pagination-button[data-vs-target="1"]'))
      .toHaveAttribute('aria-label', 'Go to About');
    await expect(page.locator('.vs-pagination-button[data-vs-target="2"]'))
      .toHaveAttribute('aria-label', 'Go to Services');
    await expect(page.locator('.vs-pagination-button[data-vs-target="3"]'))
      .toHaveAttribute('aria-label', 'Go to Portfolio');
    await expect(page.locator('.vs-pagination-button[data-vs-target="4"]'))
      .toHaveAttribute('aria-label', 'Go to Contact');
  });

  test('active pagination button has aria-current', async ({ page }) => {
    await waitForInit(page);

    // Initially first button has aria-current="true"
    const firstButton = page.locator('.vs-pagination-button[data-vs-target="0"]');
    await expect(firstButton).toHaveAttribute('aria-current', 'true');

    // Other buttons should not have aria-current
    const secondButton = page.locator('.vs-pagination-button[data-vs-target="1"]');
    await expect(secondButton).not.toHaveAttribute('aria-current');

    // Navigate to section 3
    await page.click('.vs-pagination-button[data-vs-target="2"]');
    await waitForScrollComplete(page);

    // aria-current should move to the third button
    const thirdButton = page.locator('.vs-pagination-button[data-vs-target="2"]');
    await expect(thirdButton).toHaveAttribute('aria-current', 'true');

    // First button should no longer have aria-current
    await expect(firstButton).not.toHaveAttribute('aria-current');
  });
});

test.describe('Focus management', () => {
  test('focus moves to section after navigation', async ({ page }) => {
    await waitForInit(page);

    // Navigate to section 2 via pagination
    await page.click('.vs-pagination-button[data-vs-target="1"]');
    await waitForScrollComplete(page);

    // The section should receive focus (plugin sets focusOnSection: true by default)
    const focusedId = await page.evaluate(() => document.activeElement?.id);
    expect(focusedId).toBe('section-2');

    // The focused section should have tabindex="-1" (set by plugin for focus management)
    await expect(page.locator('#section-2')).toHaveAttribute('tabindex', '-1');
  });

  test('focus moves to section after keyboard navigation', async ({ page }) => {
    await waitForInit(page);

    // Press down arrow to go to section 2
    await page.keyboard.press('ArrowDown');
    await waitForScrollComplete(page);

    // Section 2 should be focused
    const focusedId = await page.evaluate(() => document.activeElement?.id);
    expect(focusedId).toBe('section-2');
  });
});

test.describe('Tab navigation through pagination dots', () => {
  test('tab navigation works through pagination dots', async ({ page }) => {
    await waitForInit(page);

    // Focus the first pagination button
    await page.locator('.vs-pagination-button[data-vs-target="0"]').focus();

    // Verify it is focused
    let focusedTarget = await page.evaluate(() =>
      document.activeElement?.getAttribute('data-vs-target')
    );
    expect(focusedTarget).toBe('0');

    // Tab to next button
    await page.keyboard.press('Tab');
    focusedTarget = await page.evaluate(() =>
      document.activeElement?.getAttribute('data-vs-target')
    );
    expect(focusedTarget).toBe('1');

    // Tab again
    await page.keyboard.press('Tab');
    focusedTarget = await page.evaluate(() =>
      document.activeElement?.getAttribute('data-vs-target')
    );
    expect(focusedTarget).toBe('2');

    // Tab again
    await page.keyboard.press('Tab');
    focusedTarget = await page.evaluate(() =>
      document.activeElement?.getAttribute('data-vs-target')
    );
    expect(focusedTarget).toBe('3');

    // Tab again
    await page.keyboard.press('Tab');
    focusedTarget = await page.evaluate(() =>
      document.activeElement?.getAttribute('data-vs-target')
    );
    expect(focusedTarget).toBe('4');
  });
});
