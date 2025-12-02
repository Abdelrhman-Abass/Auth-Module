// src/controllers/auth.controller.ts
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  type Profile,
  type VerifyCallback,
} from "passport-google-oauth20";
import type { Request, Response, NextFunction, Application } from "express";

// import { prisma } from "../prisma/client";
import {
  clearRefreshTokenCookie,
  generateAccessToken,
  issueTokens,
  verifyRefreshToken,
} from "../utils/tokensUtils";
import {
  comparePassword,
  createSuccessResponse,
  formatUserResponse,
} from "../utils/helpers";
import {
  UnauthorizedError,
  ConflictError,
  NotFoundError,
} from "../errors/AppError";
import { HTTP_STATUS } from "../utils/constants";
import { AuthRequest, User } from "../Types/types";
import { config } from "../config/config";
import { findRefreshToken, deleteRefreshToken } from "../services/token.service";
import { userService } from "../services/user.service";

type PassportInfo = { message?: string };

/**
 * Register new user
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(UnauthorizedError("Name, email and password are required"));
  }

  const existingUser = await userService.findByEmail(email);
  if (existingUser) {
    return next(ConflictError("Email already registered"));
  }

  const user = await userService.createWithEmail({ name, email, password });

  const { accessToken, refreshToken } = await issueTokens(res, user.id);

  return res.status(HTTP_STATUS.CREATED).json(
    createSuccessResponse("Registration successful", {
      accessToken,
      refreshToken,
      user: formatUserResponse(user),
    })
  );
};

/**
 * Login user
 * Authenticates user credentials and returns JWT tokens
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const user = await userService.findByEmail(email);

  if (!user || !user.passwordHash) {
    return next(UnauthorizedError("Invalid credentials"));
    return;
  }

  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    return next(UnauthorizedError("Invalid credentials"));
  }

  const { accessToken, refreshToken } = await issueTokens(res, user.id);

  return res.json(
    createSuccessResponse("Login successful", {
      accessToken,
      refreshToken,
      user: formatUserResponse(user),
    })
  );
};

/**
 * Refresh Token
 * Accepts refresh token from body or cookies
 */
export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.body.refreshToken || req.cookies["refresh_token"];

  if (!refreshToken) {
    return next(UnauthorizedError("No refresh token provided"));
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    clearRefreshTokenCookie(res);
    return next(UnauthorizedError("Invalid or expired refresh token"));
  }

  const storedToken = await findRefreshToken(refreshToken);
  if (!storedToken || storedToken.expiresAt < new Date()) {
    clearRefreshTokenCookie(res);
    return next(UnauthorizedError("Refresh token revoked or expired"));
  }

  const accessToken = generateAccessToken(String(decoded.userId));

  return res.json(
    createSuccessResponse("Token refreshed successfully", { accessToken })
  );
};

/**
 * Get authenticated user profile
 */
export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const user = await userService.findById(userId);
  if (!user) return next(NotFoundError("User not found"));

  res.json(createSuccessResponse("Profile retrieved successfully", formatUserResponse(user)));
};

/**
 * Logout - invalidate refresh token
 */
export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken || req.cookies["refresh_token"];

  if (refreshToken) {
    await deleteRefreshToken(refreshToken);
  }

  clearRefreshTokenCookie(res);

  return res.json(createSuccessResponse("Logged out successfully"));
};

/**
 * Google OAuth callback handler
 * Handles both login and register - automatically creates user if they don't exist
 */
export const googleAuthCallback = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "google",
    { session: false },
    async (err: any, user: User | false, info: PassportInfo) => {
      if (err || !user) {
        const errorMsg = err?.message || info?.message || "Google authentication failed";
        return res.redirect(`${config.FRONTEND_URL}/auth/callback?error=${encodeURIComponent(errorMsg)}`);
      }

      try {
        const { accessToken, refreshToken } = await issueTokens(res, user.id);

        const userData = {
          id: user.id,
          email: user.email,
          name: user.name,
        };

        return res.redirect(
          `${config.FRONTEND_URL}/auth/callback?token=${accessToken}&refresh=${refreshToken}&user=${encodeURIComponent(JSON.stringify(userData))}`
        );
      } catch (error) {
        next(error);
      }
    }
  )(req, res, next);
};

/**
 * Setup Passport with Google OAuth strategy
 * Handles both login and register - creates user automatically if they don't exist
 */
export function setupPassport(app: Application) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: `${config.BACKEND_URL}/api/auth/google/callback`,
      },
      async (_accessToken, _refreshToken, profile: Profile, done: VerifyCallback) => {
        try {
          const user = await userService.createOrUpdateWithGoogle(profile);
          return done(null, user);
        } catch (err) {
          return done(err as Error);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => done(null, user.id));

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await userService.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  app.use(passport.initialize());
}

/**
 * Initiate Google OAuth
 */
export const initiateGoogleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});