module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>'],
    testMatch: ['**/__tests__/**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    collectCoverageFrom: [
        'controllers/**/*.ts',
        'middlewares/**/*.ts',
        'utils/**/*.ts',
        '!**/*.d.ts',
        '!**/node_modules/**',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
    setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
    testTimeout: 10000,
    verbose: true,
};
