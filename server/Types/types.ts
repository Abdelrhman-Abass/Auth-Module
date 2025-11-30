import type { Request } from "express";
import type { prisma } from "../prisma/client";

export type RequestWithConfig = Request & {
    config: AuthConfig;
    db: typeof prisma;
    user?: { id: number };
};

export interface AuthRequest extends Request {
    userId?: string;
  }

export type AuthConfig = {
    DATABASE_URL: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    CLIENT_URL: string;
    ACCESS_TOKEN_EXPIRES_IN?: string;
    REFRESH_TOKEN_EXPIRES_IN?: string;
};

export type AppError = {
    message: string;
    statusCode: number;
    isOperational: true;
    name: "AppError";
    stack?: string;
};


export interface User {
    id: string;
    name: string;
    email: string;
    passwordHash?: string | null;
    googleId?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUserDTO {
    name: string;
    email: string;
    password?: string;
    googleId?: string;
}

export interface UserSession {
    userId: string;
    email: string;
    name: string;
}

export interface RefreshToken {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
}

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}