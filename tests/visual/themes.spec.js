// @ts-check
const { test, expect } = require('@playwright/test');

const THEMES_URL = '/tests/e2e/fixtures/themes-page.html';

/**
 * Wait for all theme containers to initialize
 */
async function waitForAllThemesInit(page) {
  await page.goto(THEMES_URL);
  // Wait for all 4 containers to initialize
  await page.waitForSelector('#theme-default.vs-initialized', { timeout: 10000 });
  await page.waitForSelector('#theme-light.vs-initialized', { timeout: 10000 });
  await page.waitForSelector('#theme-dark.vs-initialized', { timeout: 10000 });
  await page.waitForSelector('#theme-minimal.vs-initialized', { timeout: 10000 });
}

test.describe('Theme visual regression', () => {
  test('default theme pagination', async ({ page }) => {
    await waitForAllThemesInit(page);

    const defaultContainer = page.locator('#theme-default');
    const pagination = defaultContainer.locator('.vs-pagination');
    await expect(pagination).toBeVisible();

    await expect(pagination).toHaveScreenshot('default-theme-pagination.png', {
      maxDiffPixelRatio: 0.01,
    });
  });

  test('dark theme pagination', async ({ page }) => {
    await waitForAllThemesInit(page);

    const darkContainer = page.locator('#theme-dark');
    const pagination = darkContainer.locator('.vs-pagination');
    await expect(pagination).toBeVisible();

    await expect(pagination).toHaveScreenshot('dark-theme-pagination.png', {
      maxDiffPixelRatio: 0.01,
    });
  });

  test('light theme pagination', async ({ page }) => {
    await waitForAllThemesInit(page);

    const lightContainer = page.locator('#theme-light');
    const pagination = lightContainer.locator('.vs-pagination');
    await expect(pagination).toBeVisible();

    await expect(pagination).toHaveScreenshot('light-theme-pagination.png', {
      maxDiffPixelRatio: 0.01,
    });
  });

  test('minimal theme pagination', async ({ page }) => {
    await waitForAllThemesInit(page);

    const minimalContainer = page.locator('#theme-minimal');
    const pagination = minimalContainer.locator('.vs-pagination');
    await expect(pagination).toBeVisible();

    await expect(pagination).toHaveScreenshot('minimal-theme-pagination.png', {
      maxDiffPixelRatio: 0.01,
    });
  });

  test('pagination hover state with tooltip visible', async ({ page }) => {
    await waitForAllThemesInit(page);

    const defaultContainer = page.locator('#theme-default');
    const firstButton = defaultContainer.locator('.vs-pagination-button').first();

    // Hover over the first pagination button to show tooltip
    await firstButton.hover();

    // Wait for tooltip transition (0.3s in CSS)
    await page.waitForTimeout(400);

    // Tooltip should be visible
    const tooltip = firstButton.locator('.vs-pagination-tooltip');
    await expect(tooltip).toBeVisible();

    // Screenshot the pagination with the tooltip visible
    const pagination = defaultContainer.locator('.vs-pagination');
    await expect(pagination).toHaveScreenshot('pagination-hover-tooltip.png', {
      maxDiffPixelRatio: 0.01,
    });
  });

  test('pagination hidden at mobile breakpoint', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(THEMES_URL);

    // At mobile viewport (< 768px), the CSS hides pagination via media query
    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Pagination should be hidden (display: none via CSS media query)
    const pagination = page.locator('.vs-pagination').first();

    // The pagination exists in DOM but is hidden by CSS
    await expect(pagination).toBeHidden();

    // Take a screenshot of the full page at mobile size
    await expect(page).toHaveScreenshot('mobile-breakpoint-no-pagination.png', {
      maxDiffPixelRatio: 0.01,
    });
  });
});
