import { authenticateToken } from '../../middlewares/authMiddleware';
import { mockRequest, mockResponse, mockNext, createTestUser } from '../helpers';
import { generateAccessToken } from '../../utils/tokensUtils';
import { prisma } from '../../prisma/client';
import { AuthRequest } from '../../Types/types';

// Mock Prisma
jest.mock('../../prisma/client', () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
        },
    },
}));

describe('Auth Middleware', () => {
    let req: Partial<AuthRequest>;
    let res: Partial<any>;
    let next: jest.Mock;

    beforeEach(() => {
        req = mockRequest();
        res = mockResponse();
        next = mockNext;
        jest.clearAllMocks();
    });

    describe('authenticateToken', () => {
        it('should allow request with valid token', async () => {
            const testUser = createTestUser();
            const token = generateAccessToken(testUser.id);

            req.headers = {
                authorization: `Bearer ${token}`,
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(testUser);

            await authenticateToken(req as AuthRequest, res as any, next);

            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { id: testUser.id },
            });
            expect((req as AuthRequest).userId).toBe(testUser.id);
            expect(next).toHaveBeenCalledWith();
            expect(next).toHaveBeenCalledTimes(1);
        });

        it('should reject request without token', async () => {
            req.headers = {};

            await authenticateToken(req as AuthRequest, res as any, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Access token required',
                })
            );
            expect((req as AuthRequest).userId).toBeUndefined();
        });

        it('should reject request with invalid token', async () => {
            req.headers = {
                authorization: 'Bearer invalid-token',
            };

            await authenticateToken(req as AuthRequest, res as any, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Invalid or expired access token',
                })
            );
        });

        it('should reject request with malformed Authorization header', async () => {
            req.headers = {
                authorization: 'InvalidFormat',
            };

            await authenticateToken(req as AuthRequest, res as any, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Access token required',
                })
            );
        });

        it('should reject request for non-existent user', async () => {
            const token = generateAccessToken('non-existent-user-id');

            req.headers = {
                authorization: `Bearer ${token}`,
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            await authenticateToken(req as AuthRequest, res as any, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Invalid or inactive user',
                })
            );
        });

        it('should handle database errors gracefully', async () => {
            const testUser = createTestUser();
            const token = generateAccessToken(testUser.id);

            req.headers = {
                authorization: `Bearer ${token}`,
            };

            (prisma.user.findUnique as jest.Mock).mockRejectedValue(
                new Error('Database connection failed')
            );

            await authenticateToken(req as AuthRequest, res as any, next);

            expect(next).toHaveBeenCalled();
        });

        it('should extract userId and inject into request', async () => {
            const testUser = createTestUser({ id: 'specific-user-id' });
            const token = generateAccessToken(testUser.id);

            req.headers = {
                authorization: `Bearer ${token}`,
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(testUser);

            await authenticateToken(req as AuthRequest, res as any, next);

            expect((req as AuthRequest).userId).toBe('specific-user-id');
        });
    });
});
