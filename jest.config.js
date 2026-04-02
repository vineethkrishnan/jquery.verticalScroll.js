module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    testMatch: ['**/tests/unit/**/*.test.js'],
    setupFiles: ['./tests/setup.js'],
    verbose: true,
    testTimeout: 10000
};
