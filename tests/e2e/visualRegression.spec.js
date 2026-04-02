// @ts-check
const { test, expect } = require('@playwright/test');

const path = require('path');
const FIXTURE_URL = 'file://' + path.resolve(__dirname, '../fixtures/index.html');

/**
 * Helper: wait for plugin initialization and disable animations for stable screenshots
 */
async function waitForInit(page) {
    await page.waitForSelector('.vs-initialized', { timeout: 5000 });
    // Disable all CSS animations/transitions for deterministic screenshots
    await page.addStyleTag({
        content: `
            *, *::before, *::after {
                animation-duration: 0s !important;
                animation-delay: 0s !important;
                transition-duration: 0s !important;
                transition-delay: 0s !important;
            }
        `,
    });
    await page.waitForTimeout(100);
}

/**
 * Helper: navigate to section and wait
 */
async function goToSection(page, index) {
    await page.evaluate((idx) => {
        $('#scroll-container').verticalScroll('scrollToSection', idx, false);
    }, index);
    await page.waitForTimeout(200);
}

// =============================================================================
// Visual Regression: Default Theme
// =============================================================================

test.describe('Visual Regression - Default Theme', () => {
    test('section 1 - initial state', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        await waitForInit(page);

        await expect(page).toHaveScreenshot('default-theme-section-1.png');
    });

    test('section 3 - middle section', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?animationDuration=0');
        await waitForInit(page);
        await goToSection(page, 2);

        await expect(page).toHaveScreenshot('default-theme-section-3.png');
    });

    test('section 5 - last section', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?animationDuration=0');
        await waitForInit(page);
        await goToSection(page, 4);

        await expect(page).toHaveScreenshot('default-theme-section-5.png');
    });
});

// =============================================================================
// Visual Regression: Light Theme
// =============================================================================

test.describe('Visual Regression - Light Theme', () => {
    test('section 1 - initial state', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?theme=light');
        await waitForInit(page);

        await expect(page).toHaveScreenshot('light-theme-section-1.png');
    });

    test('section 3 - middle section', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?theme=light&animationDuration=0');
        await waitForInit(page);
        await goToSection(page, 2);

        await expect(page).toHaveScreenshot('light-theme-section-3.png');
    });
});

// =============================================================================
// Visual Regression: Dark Theme
// =============================================================================

test.describe('Visual Regression - Dark Theme', () => {
    test('section 1 - initial state', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?theme=dark');
        await waitForInit(page);

        await expect(page).toHaveScreenshot('dark-theme-section-1.png');
    });

    test('section 3 - middle section', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?theme=dark&animationDuration=0');
        await waitForInit(page);
        await goToSection(page, 2);

        await expect(page).toHaveScreenshot('dark-theme-section-3.png');
    });
});

// =============================================================================
// Visual Regression: Minimal Theme
// =============================================================================

test.describe('Visual Regression - Minimal Theme', () => {
    test('section 1 - initial state', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?theme=minimal');
        await waitForInit(page);

        await expect(page).toHaveScreenshot('minimal-theme-section-1.png');
    });

    test('section 3 - middle section', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?theme=minimal&animationDuration=0');
        await waitForInit(page);
        await goToSection(page, 2);

        await expect(page).toHaveScreenshot('minimal-theme-section-3.png');
    });
});

// =============================================================================
// Visual Regression: Pagination States
// =============================================================================

test.describe('Visual Regression - Pagination', () => {
    test('pagination dots - right position (default)', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        await waitForInit(page);

        const pagination = page.locator('.vs-pagination');
        await expect(pagination).toHaveScreenshot('pagination-right-default.png');
    });

    test('pagination dots - left position', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?paginationPosition=left');
        await waitForInit(page);

        const pagination = page.locator('.vs-pagination');
        await expect(pagination).toHaveScreenshot('pagination-left.png');
    });

    test('pagination dots - active on section 3', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?animationDuration=0');
        await waitForInit(page);
        await goToSection(page, 2);

        const pagination = page.locator('.vs-pagination');
        await expect(pagination).toHaveScreenshot('pagination-active-section-3.png');
    });

    test('pagination dots - active on last section', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?animationDuration=0');
        await waitForInit(page);
        await goToSection(page, 4);

        const pagination = page.locator('.vs-pagination');
        await expect(pagination).toHaveScreenshot('pagination-active-last-section.png');
    });
});

// =============================================================================
// Visual Regression: No Pagination
// =============================================================================

test.describe('Visual Regression - No Pagination', () => {
    test('full page without pagination dots', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?pagination=false');
        await waitForInit(page);

        await expect(page).toHaveScreenshot('no-pagination.png');
    });
});

// =============================================================================
// Visual Regression: Mobile Viewport
// =============================================================================

test.describe('Visual Regression - Mobile', () => {
    test('mobile viewport (375x667)', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(FIXTURE_URL);
        await page.waitForTimeout(500);

        await expect(page).toHaveScreenshot('mobile-375x667.png');
    });

    test('tablet viewport (768x1024)', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.goto(FIXTURE_URL);
        await waitForInit(page);

        await expect(page).toHaveScreenshot('tablet-768x1024.png');
    });
});

// =============================================================================
// Visual Regression: Section Transitions
// =============================================================================

test.describe('Visual Regression - Navigation States', () => {
    test('after navigating through all sections', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?animationDuration=0');
        await waitForInit(page);

        // Navigate through all sections and verify final state
        for (let i = 1; i <= 4; i++) {
            await goToSection(page, i);
        }

        await expect(page).toHaveScreenshot('navigated-to-last-section.png');
    });

    test('returned to first section after full traversal', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?animationDuration=0');
        await waitForInit(page);

        // Go to last, then back to first
        await goToSection(page, 4);
        await goToSection(page, 0);

        await expect(page).toHaveScreenshot('returned-to-first-section.png');
    });
});
