const { compilerOptions } = require('./tsconfig.json')
const { pathsToModuleNameMapper } = require('ts-jest/utils')

module.exports = {
  roots: ['<rootDir>/src'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>',
  }),
  testPathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/dist/',
    '<rootDir>/node_modules/',
    '<rootDir>/src/infrastructure/database',
  ],
  coverageDirectory: 'coverage',
  clearMocks: true,
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
  // setupFiles: ['dotenv/config']
}
