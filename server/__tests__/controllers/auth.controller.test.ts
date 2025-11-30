import { register, login, logout, getProfile } from '../../controllers/auth.controller';
import { mockRequest, mockResponse, mockNext, createTestUser } from '../helpers';
import { prisma } from '../../prisma/client';
import { hashPassword } from '../../utils/helpers';
import { AuthRequest } from '../../Types/types';

// Mock dependencies
jest.mock('../../prisma/client', () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
        refreshToken: {
            create: jest.fn(),
            findUnique: jest.fn(),
            deleteMany: jest.fn(),
        },
    },
}));

jest.mock('../../utils/tokensUtils', () => ({
    ...jest.requireActual('../../utils/tokensUtils'),
    issueTokens: jest.fn(),
}));

describe('Auth Controller', () => {
    let req: Partial<any>;
    let res: Partial<any>;
    let next: jest.Mock;

    beforeEach(() => {
        req = mockRequest();
        res = mockResponse();
        next = mockNext;
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should successfully register a new user', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'Password123!',
            };

            req['body'] = userData;

            const newUser = createTestUser({
                name: userData.name,
                email: userData.email,
            });

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
            (prisma.user.create as jest.Mock).mockResolvedValue(newUser);

            const { issueTokens } = require('../../utils/tokensUtils');
            issueTokens.mockResolvedValue({
                accessToken: 'access-token',
                refreshToken: 'refresh-token',
            });

            await register(req as any, res as any, next);

            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { email: userData.email },
            });
            expect(prisma.user.create).toHaveBeenCalled();
            expect(res['status']).toHaveBeenCalledWith(201);
            expect(res['json']).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: 'Registration successful',
                })
            );
        });

        it('should reject duplicate email registration', async () => {
            req['body'] = {
                name: 'Test User',
                email: 'existing@example.com',
                password: 'Password123!',
            };

            const existingUser = createTestUser({ email: 'existing@example.com' });
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);

            await register(req as any, res as any, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Email already registered',
                })
            );
            expect(prisma.user.create).not.toHaveBeenCalled();
        });

        it('should hash password before storing', async () => {
            req['body'] = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'PlainPassword123',
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
            (prisma.user.create as jest.Mock).mockImplementation((data) => {
                expect(data.data.passwordHash).not.toBe('PlainPassword123');
                expect(data.data.passwordHash).toMatch(/^\$2b\$/);
                return Promise.resolve(createTestUser());
            });

            const { issueTokens } = require('../../utils/tokensUtils');
            issueTokens.mockResolvedValue({
                accessToken: 'token',
                refreshToken: 'refresh',
            });

            await register(req as any, res as any, next);

            expect(prisma.user.create).toHaveBeenCalled();
        });
    });

    describe('login', () => {
        it('should successfully login with valid credentials', async () => {
            const password = 'Password123!';
            const hashedPassword = await hashPassword(password);

            req['body'] = {
                email: 'test@example.com',
                password: password,
            };

            const user = createTestUser({
                email: 'test@example.com',
                passwordHash: hashedPassword,
            });

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);

            const { issueTokens } = require('../../utils/tokensUtils');
            issueTokens.mockResolvedValue({
                accessToken: 'access-token',
                refreshToken: 'refresh-token',
            });

            await login(req as any, res as any, next);

            expect(res['json']).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: 'Login successful',
                })
            );
        });

        it('should reject login with invalid email', async () => {
            req['body'] = {
                email: 'nonexistent@example.com',
                password: 'Password123!',
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            await login(req as any, res as any, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Invalid credentials',
                })
            );
        });

        it('should reject login with incorrect password', async () => {
            const correctPassword = 'CorrectPassword123!';
            const hashedPassword = await hashPassword(correctPassword);

            req['body'] = {
                email: 'test@example.com',
                password: 'WrongPassword123!',
            };

            const user = createTestUser({
                passwordHash: hashedPassword,
            });

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);

            await login(req as any, res as any, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Invalid credentials',
                })
            );
        });

        it('should reject login for user without password', async () => {
            req['body'] = {
                email: 'google-user@example.com',
                password: 'Password123!',
            };

            const googleUser = createTestUser({
                passwordHash: null,
                googleId: 'google-id-123',
            });

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(googleUser);

            await login(req as any, res as any, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Invalid credentials',
                })
            );
        });
    });

    describe('logout', () => {
        it('should successfully logout and invalidate refresh token', async () => {
            req['body'] = {
                refreshToken: 'valid-refresh-token',
            };

            (prisma.refreshToken.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });

            await logout(req as any, res as any);

            expect(prisma.refreshToken.deleteMany).toHaveBeenCalledWith({
                where: { token: 'valid-refresh-token' },
            });
            expect(res['json']).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: 'Logged out successfully',
                })
            );
        });

        it('should handle logout without refresh token', async () => {
            req['body'] = {};
            req['cookies'] = {};

            await logout(req as any, res as any);

            expect(res['json']).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                })
            );
        });

        it('should read refresh token from cookies', async () => {
            req['cookies'] = {
                refresh_token: 'cookie-refresh-token',
            };

            (prisma.refreshToken.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });

            await logout(req as any, res as any);

            expect(prisma.refreshToken.deleteMany).toHaveBeenCalledWith({
                where: { token: 'cookie-refresh-token' },
            });
        });
    });

    describe('getProfile', () => {
        it('should return user profile with valid authentication', async () => {
            const user = createTestUser();

            (req as AuthRequest).userId = user.id;
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);

            await getProfile(req as AuthRequest, res as any, next);

            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { id: user.id },
            });
            expect(res['status']).toHaveBeenCalledWith(200);
            expect(res['json']).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: 'Profile retrieved successfully',
                })
            );
        });

        it('should reject request without userId', async () => {
            req['userId'] = undefined;

            await getProfile(req as AuthRequest, res as any, next);

            expect(res['status']).toHaveBeenCalledWith(401);
            expect(res['json']).toHaveBeenCalledWith({
                message: 'Unauthorized',
            });
        });

        it('should handle non-existent user', async () => {
            (req as AuthRequest).userId = 'non-existent-id';
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            await getProfile(req as AuthRequest, res as any, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'User not found',
                })
            );
        });
    });
});
