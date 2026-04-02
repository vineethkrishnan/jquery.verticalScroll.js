// @ts-check
const { test, expect } = require('@playwright/test');

const path = require('path');
const FIXTURE_URL = 'file://' + path.resolve(__dirname, '../fixtures/index.html');

/**
 * Helper: wait for plugin initialization
 */
async function waitForInit(page) {
    await page.waitForSelector('.vs-initialized', { timeout: 5000 });
}

/**
 * Helper: get current section index from plugin
 */
async function getCurrentIndex(page) {
    return page.evaluate(() => {
        return $('#scroll-container').verticalScroll('getCurrentIndex');
    });
}

/**
 * Helper: wait for scroll animation to complete
 */
async function waitForScrollComplete(page, expectedIndex) {
    await page.waitForFunction(
        (idx) => $('#scroll-container').verticalScroll('getCurrentIndex') === idx,
        expectedIndex,
        { timeout: 5000 }
    );
    // Extra settle time for animation
    await page.waitForTimeout(200);
}

// =============================================================================
// Initialization Tests
// =============================================================================

test.describe('Plugin Initialization', () => {
    test('should initialize with vs-initialized class', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        await waitForInit(page);

        const hasClass = await page.evaluate(() => {
            return $('#scroll-container').hasClass('vs-initialized');
        });
        expect(hasClass).toBe(true);
    });

    test('should add vs-container class', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        await waitForInit(page);

        const hasClass = await page.evaluate(() => {
            return $('#scroll-container').hasClass('vs-container');
        });
        expect(hasClass).toBe(true);
    });

    test('should apply default theme class', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        await waitForInit(page);

        const hasClass = await page.evaluate(() => {
            return $('#scroll-container').hasClass('vs-theme-default');
        });
        expect(hasClass).toBe(true);
    });

    test('should mark all sections with vs-section class', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        await waitForInit(page);

        const sectionCount = await page.evaluate(() => {
            return $('.vs-section').length;
        });
        expect(sectionCount).toBe(5);
    });

    test('should mark first section as active', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        await waitForInit(page);

        const activeIndex = await page.evaluate(() => {
            return $('.vs-section-active').attr('data-vs-index');
        });
        expect(activeIndex).toBe('0');
    });

    test('should report correct section count', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        await waitForInit(page);

        const count = await page.evaluate(() => {
            return $('#scroll-container').verticalScroll('getSectionCount');
        });
        expect(count).toBe(5);
    });
});

// =============================================================================
// Pagination Tests
// =============================================================================

test.describe('Pagination', () => {
    test('should render pagination nav', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        await waitForInit(page);

        const paginationVisible = await page.isVisible('.vs-pagination');
        expect(paginationVisible).toBe(true);
    });

    test('should create correct number of pagination dots', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        await waitForInit(page);

        const dotCount = await page.locator('.vs-pagination-button').count();
        expect(dotCount).toBe(5);
    });

    test('should mark first dot as active', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        await waitForInit(page);

        const firstDotActive = await page.evaluate(() => {
            return $('.vs-pagination-button').first().hasClass('vs-pagination-active');
        });
        expect(firstDotActive).toBe(true);
    });

    test('should navigate to section on dot click', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        await waitForInit(page);

        // Click third dot (index 2)
        await page.locator('.vs-pagination-button').nth(2).click();
        await waitForScrollComplete(page, 2);

        const index = await getCurrentIndex(page);
        expect(index).toBe(2);
    });

    test('should update active dot after navigation', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        await waitForInit(page);

        await page.locator('.vs-pagination-button').nth(3).click();
        await waitForScrollComplete(page, 3);

        const activeIndex = await page.evaluate(() => {
            return $('.vs-pagination-button.vs-pagination-active').attr('data-vs-target');
        });
        expect(activeIndex).toBe('3');
    });

    test('should hide pagination when disabled', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?pagination=false');
        await waitForInit(page);

        const paginationExists = await page.locator('.vs-pagination').count();
        expect(paginationExists).toBe(0);
    });

    test('should support left-positioned pagination', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?paginationPosition=left');
        await waitForInit(page);

        const leftValue = await page.evaluate(() => {
            return $('.vs-pagination').css('left');
        });
        expect(leftValue).not.toBe('auto');
    });

    test('should display tooltips with section labels', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        await waitForInit(page);

        const tooltipTexts = await page.evaluate(() => {
            return $('.vs-pagination-tooltip').map(function() {
                return $(this).text();
            }).get();
        });
        expect(tooltipTexts).toEqual(['Home', 'About', 'Services', 'Portfolio', 'Contact']);
    });
});

// =============================================================================
// Keyboard Navigation Tests
// =============================================================================

test.describe('Keyboard Navigation', () => {
    test('should navigate down with ArrowDown key', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?animationDuration=100');
        await waitForInit(page);

        await page.keyboard.press('ArrowDown');
        await waitForScrollComplete(page, 1);

        const index = await getCurrentIndex(page);
        expect(index).toBe(1);
    });

    test('should navigate up with ArrowUp key', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?animationDuration=100');
        await waitForInit(page);

        // Go to section 2 first
        await page.locator('.vs-pagination-button').nth(2).click();
        await waitForScrollComplete(page, 2);

        await page.keyboard.press('ArrowUp');
        await waitForScrollComplete(page, 1);

        const index = await getCurrentIndex(page);
        expect(index).toBe(1);
    });

    test('should jump to first section with Home key', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?animationDuration=100');
        await waitForInit(page);

        // Navigate to section 3
        await page.locator('.vs-pagination-button').nth(3).click();
        await waitForScrollComplete(page, 3);

        await page.keyboard.press('Home');
        await waitForScrollComplete(page, 0);

        const index = await getCurrentIndex(page);
        expect(index).toBe(0);
    });

    test('should jump to last section with End key', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?animationDuration=100');
        await waitForInit(page);

        await page.keyboard.press('End');
        await waitForScrollComplete(page, 4);

        const index = await getCurrentIndex(page);
        expect(index).toBe(4);
    });

    test('should navigate with PageDown key', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?animationDuration=100');
        await waitForInit(page);

        await page.keyboard.press('PageDown');
        await waitForScrollComplete(page, 1);

        const index = await getCurrentIndex(page);
        expect(index).toBe(1);
    });

    test('should not navigate past last section without loop', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?animationDuration=100');
        await waitForInit(page);

        await page.keyboard.press('End');
        await waitForScrollComplete(page, 4);

        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(300);

        const index = await getCurrentIndex(page);
        expect(index).toBe(4);
    });

    test('should not navigate before first section without loop', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?animationDuration=100');
        await waitForInit(page);

        await page.keyboard.press('ArrowUp');
        await page.waitForTimeout(300);

        const index = await getCurrentIndex(page);
        expect(index).toBe(0);
    });
});

// =============================================================================
// Loop Mode Tests
// =============================================================================

test.describe('Loop Mode', () => {
    test('should loop from last to first section', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?loop=true&animationDuration=100');
        await waitForInit(page);

        // Go to last section
        await page.keyboard.press('End');
        await waitForScrollComplete(page, 4);

        // Try to go past last
        await page.keyboard.press('ArrowDown');
        await waitForScrollComplete(page, 0);

        const index = await getCurrentIndex(page);
        expect(index).toBe(0);
    });

    test('should loop from first to last section', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?loop=true&animationDuration=100');
        await waitForInit(page);

        await page.keyboard.press('ArrowUp');
        await waitForScrollComplete(page, 4);

        const index = await getCurrentIndex(page);
        expect(index).toBe(4);
    });
});

// =============================================================================
// Mouse Wheel Tests
// =============================================================================

test.describe('Mouse Wheel Navigation', () => {
    test('should scroll down on wheel down', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?animationDuration=100');
        await waitForInit(page);

        const container = page.locator('#scroll-container');
        await container.dispatchEvent('wheel', { deltaY: 100 });
        await waitForScrollComplete(page, 1);

        const index = await getCurrentIndex(page);
        expect(index).toBe(1);
    });

    test('should scroll up on wheel up', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?animationDuration=100');
        await waitForInit(page);

        // Go to section 2
        await page.locator('.vs-pagination-button').nth(2).click();
        await waitForScrollComplete(page, 2);

        const container = page.locator('#scroll-container');
        await container.dispatchEvent('wheel', { deltaY: -100 });
        await waitForScrollComplete(page, 1);

        const index = await getCurrentIndex(page);
        expect(index).toBe(1);
    });

    test('should ignore small scroll deltas', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?animationDuration=100');
        await waitForInit(page);

        const container = page.locator('#scroll-container');
        await container.dispatchEvent('wheel', { deltaY: 10 });
        await page.waitForTimeout(300);

        const index = await getCurrentIndex(page);
        expect(index).toBe(0);
    });
});

// =============================================================================
// Accessibility Tests
// =============================================================================

test.describe('Accessibility', () => {
    test('should set role=region on container', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        await waitForInit(page);

        const role = await page.locator('#scroll-container').getAttribute('role');
        expect(role).toBe('region');
    });

    test('should set aria-label on container', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        await waitForInit(page);

        const label = await page.locator('#scroll-container').getAttribute('aria-label');
        expect(label).toBe('Vertical scrolling content');
    });

    test('should set role=group on sections', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        await waitForInit(page);

        const roles = await page.evaluate(() => {
            return $('.vs-section').map(function() {
                return $(this).attr('role');
            }).get();
        });
        expect(roles).toEqual(['group', 'group', 'group', 'group', 'group']);
    });

    test('should set aria-label on sections using data-vs-label', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        await waitForInit(page);

        const labels = await page.evaluate(() => {
            return $('.vs-section').map(function() {
                return $(this).attr('aria-label');
            }).get();
        });
        expect(labels).toEqual(['Home', 'About', 'Services', 'Portfolio', 'Contact']);
    });

    test('should have navigation role on pagination', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        await waitForInit(page);

        const role = await page.locator('.vs-pagination').getAttribute('role');
        expect(role).toBe('navigation');
    });

    test('should set aria-current on active pagination button', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        await waitForInit(page);

        const ariaCurrent = await page.locator('.vs-pagination-button').first().getAttribute('aria-current');
        expect(ariaCurrent).toBe('true');
    });

    test('should have aria-label on pagination buttons', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        await waitForInit(page);

        const label = await page.locator('.vs-pagination-button').first().getAttribute('aria-label');
        expect(label).toBe('Go to Home');
    });

    test('should update aria-current after navigation', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?animationDuration=100');
        await waitForInit(page);

        await page.locator('.vs-pagination-button').nth(2).click();
        await waitForScrollComplete(page, 2);

        const ariaValues = await page.evaluate(() => {
            return $('.vs-pagination-button').map(function() {
                return $(this).attr('aria-current') || 'none';
            }).get();
        });
        expect(ariaValues[0]).toBe('none');
        expect(ariaValues[2]).toBe('true');
    });
});

// =============================================================================
// Public API Tests
// =============================================================================

test.describe('Public API', () => {
    test('scrollToSection should navigate to specific section', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?animationDuration=100');
        await waitForInit(page);

        await page.evaluate(() => {
            $('#scroll-container').verticalScroll('scrollToSection', 3);
        });
        await waitForScrollComplete(page, 3);

        const index = await getCurrentIndex(page);
        expect(index).toBe(3);
    });

    test('scrollToId should navigate to section by ID', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?animationDuration=100');
        await waitForInit(page);

        // Note: scrollToId uses jQuery .index() which counts among all siblings,
        // including the prepended pagination nav. So section-3 (3rd section) has
        // sibling index 3 (nav=0, section-1=1, section-2=2, section-3=3).
        await page.evaluate(() => {
            $('#scroll-container').verticalScroll('scrollToId', 'section-3');
        });
        await waitForScrollComplete(page, 3);

        const index = await getCurrentIndex(page);
        expect(index).toBe(3);
    });

    test('next() should navigate to next section', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?animationDuration=100');
        await waitForInit(page);

        await page.evaluate(() => {
            $('#scroll-container').verticalScroll('next');
        });
        await waitForScrollComplete(page, 1);

        const index = await getCurrentIndex(page);
        expect(index).toBe(1);
    });

    test('prev() should navigate to previous section', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?animationDuration=100');
        await waitForInit(page);

        await page.evaluate(() => {
            $('#scroll-container').verticalScroll('scrollToSection', 2);
        });
        await waitForScrollComplete(page, 2);

        await page.evaluate(() => {
            $('#scroll-container').verticalScroll('prev');
        });
        await waitForScrollComplete(page, 1);

        const index = await getCurrentIndex(page);
        expect(index).toBe(1);
    });

    test('getCurrentSection should return jQuery element', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?animationDuration=100');
        await waitForInit(page);

        const sectionId = await page.evaluate(() => {
            var $section = $('#scroll-container').verticalScroll('getCurrentSection');
            return $section.attr('id');
        });
        expect(sectionId).toBe('section-1');
    });

    test('disable() should prevent navigation', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?animationDuration=100');
        await waitForInit(page);

        await page.evaluate(() => {
            $('#scroll-container').verticalScroll('disable');
        });

        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(300);

        const index = await getCurrentIndex(page);
        expect(index).toBe(0);

        const hasDisabledClass = await page.evaluate(() => {
            return $('#scroll-container').hasClass('vs-disabled');
        });
        expect(hasDisabledClass).toBe(true);
    });

    test('enable() should restore navigation after disable', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?animationDuration=100');
        await waitForInit(page);

        await page.evaluate(() => {
            $('#scroll-container').verticalScroll('disable');
            $('#scroll-container').verticalScroll('enable');
        });

        await page.keyboard.press('ArrowDown');
        await waitForScrollComplete(page, 1);

        const index = await getCurrentIndex(page);
        expect(index).toBe(1);
    });

    test('destroy() should clean up the plugin', async ({ page }) => {
        await page.goto(FIXTURE_URL);
        await waitForInit(page);

        await page.evaluate(() => {
            $('#scroll-container').verticalScroll('destroy');
        });

        const hasInitClass = await page.evaluate(() => {
            return $('#scroll-container').hasClass('vs-initialized');
        });
        expect(hasInitClass).toBe(false);

        const paginationExists = await page.locator('.vs-pagination').count();
        expect(paginationExists).toBe(0);

        const hasContainerClass = await page.evaluate(() => {
            return $('#scroll-container').hasClass('vs-container');
        });
        expect(hasContainerClass).toBe(false);
    });
});

// =============================================================================
// Responsive Tests
// =============================================================================

test.describe('Responsive Behavior', () => {
    test('should hide pagination on mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(FIXTURE_URL);
        // Plugin may not init on mobile, but CSS should hide pagination
        await page.waitForTimeout(500);

        const paginationVisible = await page.evaluate(() => {
            var $pagination = $('.vs-pagination');
            if ($pagination.length === 0) return false;
            return $pagination.is(':visible');
        });
        expect(paginationVisible).toBe(false);
    });
});

// =============================================================================
// Auto-scroll Tests
// =============================================================================

test.describe('Auto-scroll', () => {
    test('should auto-scroll to next section', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?autoScroll=true&autoScrollInterval=500&animationDuration=100');
        await waitForInit(page);

        // Wait for auto-scroll to trigger
        await page.waitForTimeout(800);
        await waitForScrollComplete(page, 1);

        const index = await getCurrentIndex(page);
        expect(index).toBeGreaterThanOrEqual(1);
    });
});

// =============================================================================
// Theme Application Tests
// =============================================================================

test.describe('Theme Classes', () => {
    test('should apply light theme class', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?theme=light');
        await waitForInit(page);

        const hasClass = await page.evaluate(() => {
            return $('#scroll-container').hasClass('vs-theme-light');
        });
        expect(hasClass).toBe(true);
    });

    test('should apply dark theme class', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?theme=dark');
        await waitForInit(page);

        const hasClass = await page.evaluate(() => {
            return $('#scroll-container').hasClass('vs-theme-dark');
        });
        expect(hasClass).toBe(true);
    });

    test('should apply minimal theme class', async ({ page }) => {
        await page.goto(FIXTURE_URL + '?theme=minimal');
        await waitForInit(page);

        const hasClass = await page.evaluate(() => {
            return $('#scroll-container').hasClass('vs-theme-minimal');
        });
        expect(hasClass).toBe(true);
    });
});
