import passport from "passport";
import {
  Strategy as GoogleStrategy,
  type Profile,
  type VerifyCallback,
} from "passport-google-oauth20";
import type {
  Request,
  Response,
  NextFunction,
  Application
} from "express";

import { prisma } from "../prisma/client";
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
  hashPassword,
} from "../utils/helpers";
import {
  UnauthorizedError,
  ConflictError,
  NotFoundError,
} from "../errors/AppError";
import { HTTP_STATUS } from "../utils/constants";
import { AuthRequest, User } from "../Types/types";
import { config } from "../config/config";

type PassportInfo = { message?: string } | undefined;

/**
 * Get frontend base URL from environment or config
 */


/**
 * Register new user
 * Creates a new user account with encrypted password and generates access and refresh tokens
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return next(ConflictError("Email already registered"));
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      passwordHash,
    },
  });

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

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.passwordHash) {
    return next(UnauthorizedError("Invalid credentials"));
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
  const refreshToken = req.body.refreshToken || req.cookies?.["refresh_token"];

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

  const userId = String(decoded.userId);

  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    clearRefreshTokenCookie(res);
    return next(UnauthorizedError("Refresh token revoked or expired"));
  }

  const accessToken = generateAccessToken(userId);

  return res.json(
    createSuccessResponse("Token refreshed successfully", { accessToken })
  );
};



export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {

  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },

  });

  if (!user) {
    return next(NotFoundError('User not found'));
  }

  res.status(HTTP_STATUS.OK).json(
    createSuccessResponse("Profile retrieved successfully", formatUserResponse(user))
  );
};

/**
 * Logout – invalidate refresh token
 * Accepts refresh token from body or cookies
 */
export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken || req.cookies?.["refresh_token"];

  if (refreshToken) {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  clearRefreshTokenCookie(res);

  return res.json(createSuccessResponse("Logged out successfully"));
};

/**
 * Google OAuth callback handler
 * Handles both login and register - automatically creates user if they don't exist
 */
export const googleAuthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "google",
    { session: false },
    async (err: Error | null, user: User | false, info: PassportInfo) => {
      if (err || !user) {
        console.error(
          "Google authentication error:",
          err || info?.message || "No user found"
        );
        const frontendUrl = config.FRONTEND_URL;
        return res.redirect(
          `${frontendUrl}/auth/callback?error=${encodeURIComponent(
            err?.message || info?.message || "Google authentication failed"
          )}`
        );
      }

      req.login(user, { session: false }, async (loginErr?: Error) => {
        if (loginErr) {
          console.error("Login error:", loginErr);
          return next(loginErr);
        }

        try {
          // Generate and store tokens (also sets cookie + DB entry)
          const { accessToken, refreshToken } = await issueTokens(res, user.id);

          // Redirect to frontend with tokens
          const frontendUrl = config.FRONTEND_URL;
          return res.redirect(
            `${frontendUrl}/auth/callback?token=${accessToken}&refresh=${refreshToken}&user=${encodeURIComponent(JSON.stringify({
              id: user.id,
              email: user.email,
              name: user.name,
            }))}`
          );
        } catch (error) {
          console.error("Token or redirect error:", error);
          return next(error);
        }
      });
    }
  )(req, res, next);
};

/**
 * Setup Passport with Google OAuth strategy
 * Handles both login and register - creates user automatically if they don't exist
 */
export function setupPassport(app: Application) {
  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: `${config.BACKEND_URL}/api/auth/google/callback`,
      },
      async (
        _accessToken: string,
        _refreshToken: string,
        profile: Profile,
        done: VerifyCallback
      ) => {
        try {
          const email = profile.emails?.[0]?.value;

          if (!email) {
            return done(new Error("Google account has no email"), undefined);
          }

          // Check if user exists
          let user = await prisma.user.findUnique({ where: { email } });

          // Auto-register if user doesn't exist
          if (!user) {
            user = await prisma.user.create({
              data: {
                email,
                name: profile.displayName || email.split("@")[0] || null,
                avatar: profile.photos?.[0]?.value || null,
                googleId: profile.id,
              },
            });
            console.log("New user created via Google OAuth:", user.email);
          } else {
            // Update googleId if not set
            if (!user.googleId) {
              user = await prisma.user.update({
                where: { id: user.id },
                data: { googleId: profile.id },
              });
            }
            // Update avatar if available and not set
            if (profile.photos?.[0]?.value && !user.avatar) {
              user = await prisma.user.update({
                where: { id: user.id },
                data: { avatar: profile.photos[0].value },
              });
            }
            console.log("Existing user logged in via Google OAuth:", user.email);
          }

          return done(null, user);
        } catch (err) {
          console.error("GoogleStrategy error:", err);
          return done(err as Error);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user);
    } catch (error) {
      done(error as Error, null);
    }
  });

  app.use(passport.initialize());
}


/**
 * Initiate Google OAuth authentication
 */
export function initiateGoogleAuth(req: Request, res: Response) {
  return passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res);
}