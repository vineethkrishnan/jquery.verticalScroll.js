// @ts-check
const { defineConfig } = require('@playwright/test');
const path = require('path');

module.exports = defineConfig({
    testDir: './tests/e2e',
    outputDir: './tests/results',
    timeout: 30000,
    expect: {
        toHaveScreenshot: {
            maxDiffPixelRatio: 0.01,
            animations: 'disabled',
        },
    },
    fullyParallel: true,
    retries: 0,
    reporter: [
        ['list'],
        ['html', { outputFolder: 'tests/report', open: 'never' }],
    ],
    use: {
        viewport: { width: 1280, height: 720 },
        launchOptions: {
            executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH ||
                path.join(require('os').homedir(), '.cache/ms-playwright/chromium-1194/chrome-linux/chrome'),
        },
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: {
                browserName: 'chromium',
            },
        },
    ],
    snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',
});
