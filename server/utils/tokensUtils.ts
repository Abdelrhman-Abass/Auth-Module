import jwt, { type SignOptions } from "jsonwebtoken";
import type { Response } from "express";
import { config } from "../config/config";
import { prisma } from "../prisma/client";
import { COOKIE_CONFIG } from "./constants";

/**
 * Generate short-lived access token (60m by default)
 */
export const generateAccessToken = (userId: string): string => {
  return jwt.sign(
    {id : userId  }, config.JWT_ACCESS_SECRET,
    {
      expiresIn: config.ACCESS_TOKEN_EXPIRES_IN,
    } as SignOptions
  );
};

/**
 * Generate long-lived refresh token (30d by default)
 */
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { id : userId },config.JWT_REFRESH_SECRET,
    {
      expiresIn: config.REFRESH_TOKEN_EXPIRES_IN,
    } as SignOptions
  );
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token: string) => {
  const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET) as jwt.JwtPayload;
  
  if (!decoded ) {
    throw new Error("Invalid token");
  }

  return { userId: decoded['id'] };
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string) => {
  const decoded = jwt.verify(token, config.JWT_REFRESH_SECRET) as jwt.JwtPayload;
  
  if (!decoded || !decoded['id']) {
    throw new Error("Invalid refresh token");
  }

  return { userId: decoded['id'] };
};

/**
 * Issue tokens + store refresh token in DB + set httpOnly cookie
 * Call this after register/login/google
 */
export const issueTokens = async (res: Response, userId: string, oldToken?: string) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  // If old token exists 
  if (oldToken) {
    await prisma.refreshToken.deleteMany({ where: { token: oldToken } });
  }

  await prisma.refreshToken.create({
    data: {
      userId,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  });

  res.cookie(COOKIE_CONFIG.NAME, refreshToken, {
    httpOnly: true,
    secure: COOKIE_CONFIG.SECURE,
    sameSite: COOKIE_CONFIG.SAME_SITE,
    path: COOKIE_CONFIG.PATH,
    maxAge: COOKIE_CONFIG.MAX_AGE,
  });

  return { accessToken ,refreshToken};
};

/**
 * Clear refresh token cookie on logout
 */
export const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie(COOKIE_CONFIG.NAME, {
    httpOnly: true,
    secure: COOKIE_CONFIG.SECURE,
    sameSite: COOKIE_CONFIG.SAME_SITE,
    path: COOKIE_CONFIG.PATH,
  });
};