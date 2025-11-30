import {
    hashPassword,
    comparePassword,
    formatUserResponse,
} from '../../utils/helpers';
import { createTestUser } from '../helpers';

describe('Helper Utils', () => {
    describe('hashPassword', () => {
        it('should hash a password', async () => {
            const password = 'testPassword123';
            const hash = await hashPassword(password);

            expect(hash).toBeDefined();
            expect(hash).not.toBe(password);
            expect(hash.length).toBeGreaterThan(0);
        });

        it('should generate different hashes for same password', async () => {
            const password = 'testPassword123';
            const hash1 = await hashPassword(password);
            const hash2 = await hashPassword(password);

            expect(hash1).not.toBe(hash2);
        });

        it('should create bcrypt hash', async () => {
            const password = 'testPassword123';
            const hash = await hashPassword(password);

            // Bcrypt hashes start with $2b$
            expect(hash).toMatch(/^\$2b\$/);
        });
    });

    describe('comparePassword', () => {
        it('should return true for correct password', async () => {
            const password = 'testPassword123';
            const hash = await hashPassword(password);

            const result = await comparePassword(password, hash);
            expect(result).toBe(true);
        });

        it('should return false for incorrect password', async () => {
            const password = 'testPassword123';
            const wrongPassword = 'wrongPassword456';
            const hash = await hashPassword(password);

            const result = await comparePassword(wrongPassword, hash);
            expect(result).toBe(false);
        });

        it('should be case sensitive', async () => {
            const password = 'TestPassword123';
            const hash = await hashPassword(password);

            const result = await comparePassword('testpassword123', hash);
            expect(result).toBe(false);
        });
    });

    describe('formatUserResponse', () => {
        it('should remove passwordHash from user object', () => {
            const user = createTestUser({
                passwordHash: 'hashed-password',
            });

            const formatted = formatUserResponse(user);

            expect(formatted.passwordHash).toBeUndefined();
        });

        it('should include all safe fields', () => {
            const user = createTestUser({
                id: 'user-123',
                name: 'Test User',
                email: 'test@example.com',
            });

            const formatted = formatUserResponse(user);

            expect(formatted.id).toBe('user-123');
            expect(formatted.name).toBe('Test User');
            expect(formatted.email).toBe('test@example.com');
        });

        it('should handle null values', () => {
            const user = createTestUser({
                googleId: null,
            });

            const formatted = formatUserResponse(user);

            expect(formatted.avatar).toBeUndefined();
            expect(formatted.googleId).toBeNull();
        });

        it('should include timestamps', () => {
            const now = new Date();
            const user = createTestUser({
                createdAt: now,
                updatedAt: now,
            });

            const formatted = formatUserResponse(user);

            expect(formatted.createdAt).toBeDefined();
            expect(formatted.updatedAt).toBeDefined();
        });
    });
});
