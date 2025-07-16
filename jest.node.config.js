module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/src/__node_tests__/**/*.test.(ts|js)'
  ],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  collectCoverageFrom: [
    'src/services/**/*.{ts,js}',
    'src/utils/**/*.{ts,js}',
    '!src/**/*.d.ts',
  ],
}; 