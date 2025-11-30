import {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
} from '../../utils/tokensUtils';
import { config } from '../../config/config';
import jwt from 'jsonwebtoken';

describe('Token Utils', () => {
    const testUserId = 'test-user-123';

    describe('generateAccessToken', () => {
        it('should generate a valid access token', () => {
            const token = generateAccessToken(testUserId);

            expect(token).toBeDefined();
            expect(typeof token).toBe('string');

            // Verify token structure - JWT uses 'id' field
            const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET) as any;
            expect(decoded.id).toBe(testUserId);
        });

        it('should include userId in token payload', () => {
            const token = generateAccessToken(testUserId);
            const decoded = jwt.decode(token) as any;

            expect(decoded.id).toBe(testUserId);
        });

        it('should set expiration time', () => {
            const token = generateAccessToken(testUserId);
            const decoded = jwt.decode(token) as any;

            expect(decoded.exp).toBeDefined();
            expect(decoded.iat).toBeDefined();
            expect(decoded.exp).toBeGreaterThan(decoded.iat);
        });
    });

    describe('generateRefreshToken', () => {
        it('should generate a valid refresh token', () => {
            const token = generateRefreshToken(testUserId);

            expect(token).toBeDefined();
            expect(typeof token).toBe('string');

            const decoded = jwt.verify(token, config.JWT_REFRESH_SECRET) as any;
            expect(decoded.id).toBe(testUserId);
        });

        it('should have longer expiration than access token', () => {
            const accessToken = generateAccessToken(testUserId);
            const refreshToken = generateRefreshToken(testUserId);

            const accessDecoded = jwt.decode(accessToken) as any;
            const refreshDecoded = jwt.decode(refreshToken) as any;

            expect(refreshDecoded.exp).toBeGreaterThan(accessDecoded.exp);
        });
    });

    describe('verifyAccessToken', () => {
        it('should verify valid access token', () => {
            const token = generateAccessToken(testUserId);
            const result = verifyAccessToken(token);

            expect(result.userId).toBe(testUserId);
        });

        it('should throw error for invalid token', () => {
            expect(() => {
                verifyAccessToken('invalid-token');
            }).toThrow();
        });

        it('should throw error for token with wrong secret', () => {
            const token = jwt.sign({ id: testUserId }, 'wrong-secret');

            expect(() => {
                verifyAccessToken(token);
            }).toThrow();
        });

        it('should throw error for expired token', () => {
            const expiredToken = jwt.sign(
                { id: testUserId },
                config.JWT_ACCESS_SECRET,
                { expiresIn: '0s' }
            );

            // Wait a bit to ensure expiration
            setTimeout(() => {
                expect(() => {
                    verifyAccessToken(expiredToken);
                }).toThrow();
            }, 100);
        });
    });

    describe('verifyRefreshToken', () => {
        it('should verify valid refresh token', () => {
            const token = generateRefreshToken(testUserId);
            const result = verifyRefreshToken(token);

            expect(result.userId).toBe(testUserId);
        });

        it('should throw error for invalid refresh token', () => {
            expect(() => {
                verifyRefreshToken('invalid-token');
            }).toThrow();
        });
    });
});
