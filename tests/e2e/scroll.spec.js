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
  // The plugin sets animationDuration to 300ms in the test page
  await page.waitForTimeout(500);
}

test.describe('Plugin initialization', () => {
  test('initializes and shows pagination', async ({ page }) => {
    await waitForInit(page);

    // Container should have initialized class
    const container = page.locator('#scroll-container');
    await expect(container).toHaveClass(/vs-initialized/);
    await expect(container).toHaveClass(/vs-container/);

    // Pagination nav should be visible
    const pagination = page.locator('.vs-pagination');
    await expect(pagination).toBeVisible();

    // Should have 5 pagination buttons (one per section)
    const buttons = page.locator('.vs-pagination-button');
    await expect(buttons).toHaveCount(5);

    // First button should be active
    const firstButton = buttons.first();
    await expect(firstButton).toHaveClass(/vs-pagination-active/);
  });
});

test.describe('Pagination dot navigation', () => {
  test('clicking pagination dot navigates to correct section', async ({ page }) => {
    await waitForInit(page);

    // Click the third pagination dot (index 2)
    await page.click('.vs-pagination-button[data-vs-target="2"]');
    await waitForScrollComplete(page);

    // Third section should be active
    const section3 = page.locator('#section-3');
    await expect(section3).toHaveClass(/vs-section-active/);

    // Third pagination button should be active
    const button3 = page.locator('.vs-pagination-button[data-vs-target="2"]');
    await expect(button3).toHaveClass(/vs-pagination-active/);

    // First section should no longer be active
    const section1 = page.locator('#section-1');
    await expect(section1).not.toHaveClass(/vs-section-active/);
  });
});

test.describe('Keyboard navigation', () => {
  test('down arrow moves to next section', async ({ page }) => {
    await waitForInit(page);

    // Press down arrow
    await page.keyboard.press('ArrowDown');
    await waitForScrollComplete(page);

    // Second section should be active
    const section2 = page.locator('#section-2');
    await expect(section2).toHaveClass(/vs-section-active/);

    // Second pagination button should be active
    const button2 = page.locator('.vs-pagination-button[data-vs-target="1"]');
    await expect(button2).toHaveClass(/vs-pagination-active/);
  });

  test('up arrow moves to previous section', async ({ page }) => {
    await waitForInit(page);

    // Go to section 3 first
    await page.click('.vs-pagination-button[data-vs-target="2"]');
    await waitForScrollComplete(page);

    // Press up arrow
    await page.keyboard.press('ArrowUp');
    await waitForScrollComplete(page);

    // Second section should be active
    const section2 = page.locator('#section-2');
    await expect(section2).toHaveClass(/vs-section-active/);
  });

  test('Home key goes to first section', async ({ page }) => {
    await waitForInit(page);

    // Navigate to last section first
    await page.click('.vs-pagination-button[data-vs-target="4"]');
    await waitForScrollComplete(page);

    // Press Home key
    await page.keyboard.press('Home');
    await waitForScrollComplete(page);

    // First section should be active
    const section1 = page.locator('#section-1');
    await expect(section1).toHaveClass(/vs-section-active/);

    // First pagination button should be active
    const button1 = page.locator('.vs-pagination-button[data-vs-target="0"]');
    await expect(button1).toHaveClass(/vs-pagination-active/);
  });

  test('End key goes to last section', async ({ page }) => {
    await waitForInit(page);

    // Press End key
    await page.keyboard.press('End');
    await waitForScrollComplete(page);

    // Last section should be active
    const section5 = page.locator('#section-5');
    await expect(section5).toHaveClass(/vs-section-active/);

    // Last pagination button should be active
    const button5 = page.locator('.vs-pagination-button[data-vs-target="4"]');
    await expect(button5).toHaveClass(/vs-pagination-active/);
  });
});

test.describe('Mouse wheel navigation', () => {
  test('mouse wheel down navigates to next section', async ({ page }) => {
    await waitForInit(page);

    // Hover over the container to ensure wheel events are captured
    await page.hover('#scroll-container');

    // Scroll down with sufficient delta to exceed threshold (50)
    await page.mouse.wheel(0, 100);
    await waitForScrollComplete(page);

    // Second section should be active
    const section2 = page.locator('#section-2');
    await expect(section2).toHaveClass(/vs-section-active/);
  });

  test('mouse wheel up navigates to previous section', async ({ page }) => {
    await waitForInit(page);

    // Navigate to section 3 first
    await page.click('.vs-pagination-button[data-vs-target="2"]');
    await waitForScrollComplete(page);

    // Hover over the container
    await page.hover('#scroll-container');

    // Scroll up
    await page.mouse.wheel(0, -100);
    await waitForScrollComplete(page);

    // Second section should be active
    const section2 = page.locator('#section-2');
    await expect(section2).toHaveClass(/vs-section-active/);
  });
});

test.describe('Pagination active state', () => {
  test('pagination active state updates correctly', async ({ page }) => {
    await waitForInit(page);

    // Initially, first dot is active
    const buttons = page.locator('.vs-pagination-button');
    await expect(buttons.nth(0)).toHaveClass(/vs-pagination-active/);
    await expect(buttons.nth(1)).not.toHaveClass(/vs-pagination-active/);

    // Navigate to section 4
    await page.click('.vs-pagination-button[data-vs-target="3"]');
    await waitForScrollComplete(page);

    // Fourth dot should now be active, first should not
    await expect(buttons.nth(3)).toHaveClass(/vs-pagination-active/);
    await expect(buttons.nth(0)).not.toHaveClass(/vs-pagination-active/);

    // Navigate to section 2
    await page.click('.vs-pagination-button[data-vs-target="1"]');
    await waitForScrollComplete(page);

    // Second dot should be active, fourth should not
    await expect(buttons.nth(1)).toHaveClass(/vs-pagination-active/);
    await expect(buttons.nth(3)).not.toHaveClass(/vs-pagination-active/);
  });
});

test.describe('Section active class', () => {
  test('section active class updates correctly', async ({ page }) => {
    await waitForInit(page);

    // Initially, first section is active
    await expect(page.locator('#section-1')).toHaveClass(/vs-section-active/);
    await expect(page.locator('#section-2')).not.toHaveClass(/vs-section-active/);
    await expect(page.locator('#section-3')).not.toHaveClass(/vs-section-active/);

    // Navigate to section 3
    await page.click('.vs-pagination-button[data-vs-target="2"]');
    await waitForScrollComplete(page);

    // Only section 3 should be active
    await expect(page.locator('#section-1')).not.toHaveClass(/vs-section-active/);
    await expect(page.locator('#section-2')).not.toHaveClass(/vs-section-active/);
    await expect(page.locator('#section-3')).toHaveClass(/vs-section-active/);
    await expect(page.locator('#section-4')).not.toHaveClass(/vs-section-active/);
    await expect(page.locator('#section-5')).not.toHaveClass(/vs-section-active/);
  });
});

test.describe('Plugin destroy', () => {
  test('plugin can be destroyed and DOM is cleaned up', async ({ page }) => {
    await waitForInit(page);

    // Verify plugin is active
    await expect(page.locator('.vs-pagination')).toBeVisible();
    await expect(page.locator('#scroll-container')).toHaveClass(/vs-initialized/);

    // Destroy the plugin
    await page.evaluate(() => {
      $('#scroll-container').verticalScroll('destroy');
    });

    // Pagination should be removed
    await expect(page.locator('.vs-pagination')).toHaveCount(0);

    // Container classes should be removed
    const container = page.locator('#scroll-container');
    await expect(container).not.toHaveClass(/vs-initialized/);
    await expect(container).not.toHaveClass(/vs-container/);

    // Section classes should be removed
    const section1 = page.locator('#section-1');
    await expect(section1).not.toHaveClass(/vs-section/);
    await expect(section1).not.toHaveClass(/vs-section-active/);

    // ARIA attributes should be removed from container
    await expect(container).not.toHaveAttribute('role');
    await expect(container).not.toHaveAttribute('aria-label');

    // ARIA attributes should be removed from sections
    await expect(section1).not.toHaveAttribute('role');
    await expect(section1).not.toHaveAttribute('data-vs-index');
  });
});
