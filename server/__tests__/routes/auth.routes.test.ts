import request from 'supertest';
import { app } from '../../app';
import { prisma } from '../../prisma/client';
import { hashPassword } from '../../utils/helpers';

// Mock Prisma
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

describe('Auth Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const newUser = {
                id: 'user-123',
                name: 'Test User',
                email: 'test@example.com',
                passwordHash: 'hashed',
                avatar: null,
                googleId: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
            (prisma.user.create as jest.Mock).mockResolvedValue(newUser);
            (prisma.refreshToken.create as jest.Mock).mockResolvedValue({
                id: 'token-123',
                token: 'refresh-token',
                userId: newUser.id,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            });

            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'Password123!',
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Registration successful');
            expect(response.body.data).toHaveProperty('accessToken');
            expect(response.body.data).toHaveProperty('refreshToken');
            expect(response.body.data.user).toHaveProperty('email', 'test@example.com');
        });

        it('should reject registration with existing email', async () => {
            const existingUser = {
                id: 'user-123',
                email: 'existing@example.com',
                name: 'Existing User',
                passwordHash: 'hashed',
                avatar: null,
                googleId: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);

            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'existing@example.com',
                    password: 'Password123!',
                });

            expect(response.status).toBe(409);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('already registered');
        });

        it('should reject registration with invalid email', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'invalid-email',
                    password: 'Password123!',
                });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        it('should reject registration with short password', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'short',
                });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully with valid credentials', async () => {
            const password = 'Password123!';
            const hashedPassword = await hashPassword(password);

            const user = {
                id: 'user-123',
                name: 'Test User',
                email: 'test@example.com',
                passwordHash: hashedPassword,
                avatar: null,
                googleId: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (prisma.refreshToken.create as jest.Mock).mockResolvedValue({
                id: 'token-123',
                token: 'refresh-token',
                userId: user.id,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            });

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: password,
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Login successful');
            expect(response.body.data).toHaveProperty('accessToken');
            expect(response.body.data).toHaveProperty('refreshToken');
        });

        it('should reject login with invalid email', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'Password123!',
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Invalid credentials');
        });

        it('should reject login with incorrect password', async () => {
            const correctPassword = 'CorrectPassword123!';
            const hashedPassword = await hashPassword(correctPassword);

            const user = {
                id: 'user-123',
                email: 'test@example.com',
                passwordHash: hashedPassword,
                name: 'Test User',
                avatar: null,
                googleId: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'WrongPassword123!',
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /api/auth/logout', () => {
        it('should logout successfully', async () => {
            (prisma.refreshToken.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });

            const response = await request(app)
                .post('/api/auth/logout')
                .send({
                    refreshToken: 'valid-refresh-token',
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Logged out successfully');
        });

        it('should handle logout without refresh token', async () => {
            const response = await request(app)
                .post('/api/auth/logout')
                .send({});

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });

    describe('GET /api/auth/get-profile', () => {
        it('should return profile with valid token', async () => {
            const user = {
                id: 'user-123',
                name: 'Test User',
                email: 'test@example.com',
                passwordHash: 'hashed',
                avatar: null,
                googleId: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);

            // You'll need to generate a valid token for this test
            const { generateAccessToken } = require('../../utils/tokensUtils');
            const token = generateAccessToken(user.id);

            const response = await request(app)
                .get('/api/auth/get-profile')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('email', 'test@example.com');
        });

        it('should reject request without token', async () => {
            const response = await request(app)
                .get('/api/auth/get-profile');

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        it('should reject request with invalid token', async () => {
            const response = await request(app)
                .get('/api/auth/get-profile')
                .set('Authorization', 'Bearer invalid-token');

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });


});
