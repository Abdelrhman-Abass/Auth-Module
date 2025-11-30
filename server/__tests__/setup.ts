// Global test setup

import { NextFunction } from "express";

// Mock Passport
jest.mock('passport', () => ({
    authenticate: jest.fn((_strategy, _options, _callback) => (_req: Request, _res: Response, next: NextFunction) => next()),
    use: jest.fn(),
    initialize: jest.fn(() => (_req: Request, _res: Response, next: NextFunction) => next()),
    serializeUser: jest.fn(),
    deserializeUser: jest.fn(),
}));

beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
});

// Increase timeout for integration tests
jest.setTimeout(10000);
