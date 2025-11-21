module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/client', '<rootDir>/crm_ui'],
  testMatch: ['**/__tests__/**/*.{ts,tsx}', '**/?(*.)+(spec|test).{ts,tsx}'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/client/src/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '^@assets/(.*)$': '<rootDir>/attached_assets/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/client/__mocks__/fileMock.js'
  },
  setupFilesAfterEnv: ['<rootDir>/client/__tests__/setup.ts'],
  collectCoverageFrom: [
    'client/src/**/*.{ts,tsx}',
    'crm_ui/**/*.{ts,tsx}',
    '!client/src/**/*.d.ts',
    '!client/src/main.tsx',
    '!client/src/dev/**',
    '!crm_ui/**/*.d.ts',
  ],
  coverageDirectory: 'coverage-client',
  coverageReporters: ['text', 'lcov', 'html'],
  testEnvironmentOptions: {
    url: 'http://localhost:3000'
  }
};