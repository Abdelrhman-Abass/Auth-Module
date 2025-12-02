import { prisma } from "../prisma/client";


/**
 * Store a refresh token in the database
 */
export const storeRefreshToken = async (
    userId: string,
    token: string,
    expiresAt: Date
): Promise<void> => {
    await prisma.refreshToken.create({
        data: {
            userId,
            token,
            expiresAt,
        },
    });
};

/**
 * Delete a specific refresh token from the database
 */
export const deleteRefreshToken = async (token: string): Promise<void> => {
    await prisma.refreshToken.deleteMany({
        where: { token },
    });
};

/**
 * Find a refresh token in the database
 */
export const findRefreshToken = async (token: string) => {
    return await prisma.refreshToken.findUnique({
        where: { token },
    });
};

/**
 * Delete all refresh tokens for a specific user
 */
export const deleteUserRefreshTokens = async (userId: string): Promise<void> => {
    await prisma.refreshToken.deleteMany({
        where: { userId },
    });
};
