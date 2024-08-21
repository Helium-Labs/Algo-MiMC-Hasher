/** @type {import('jest').Config} */
const config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testMatch: ["**/tests/**/*.test.(ts|tsx|js|jsx)"],
  testEnvironment: 'node',
  transformIgnorePatterns: ['/node_modules/(?!@noble)'],
};

module.exports = config;
