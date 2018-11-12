require('babel-core/register');
require('babel-polyfill');

module.exports = {
  verbose: true,
  globalSetup: './test/setup.js',
  globalTeardown: './test/teardown.js',
  testEnvironment: './test/test-environment.js',
  setupTestFrameworkScriptFile: './test/jest.setup.js',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**.js',
    '!**/utils/**',
    '!**/models/**',
    '!**/config/**',
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 5,
      lines: 5,
      statements: 5,
    },
  },
};
