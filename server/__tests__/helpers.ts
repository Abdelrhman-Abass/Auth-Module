import { Request, Response } from 'express';
import { User } from '../Types/types';

/**
 * Create a mock Express request object
 */
export const mockRequest = (overrides: Partial<Request> = {}): Partial<Request> => {
    return {
        body: {},
        params: {},
        query: {},
        headers: {},
        cookies: {},
        ...overrides,
    };
};

/**
 * Create a mock Express response object
 */
export const mockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
        cookie: jest.fn().mockReturnThis(),
        clearCookie: jest.fn().mockReturnThis(),
        redirect: jest.fn().mockReturnThis(),
    };
    return res;
};

/**
 * Create a mock next function
 */
export const mockNext = jest.fn();

/**
 * Create a test user object
 */
export const createTestUser = (overrides: Partial<User> = {}): User => {
    return {
        id: 'test-user-id-123',
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: '$2b$10$hashedpassword',
        googleId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides,
    };
};

/**
 * Create test tokens
 */
export const createTestTokens = () => {
    return {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
    };
};

/**
 * Wait for a promise to resolve
 */
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
