import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  getProfile,
  initiateGoogleAuth,
  googleAuthCallback,
} from "../controllers/auth.controller";
import { authLimiter, tokenLimiter } from "../middlewares/rateLimiterMiddleware";
import {
  registerSchema,
  loginSchema,
} from "../validators/authValidator";
import { validate } from "../middlewares/validationMiddleware";
import { catchAsync } from "../errors/catchAsync";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

// Public Routes
router.post("/register", authLimiter, validate(registerSchema), catchAsync(register));
router.post("/login", authLimiter, validate(loginSchema), catchAsync(login));

// Google OAuth Routes
router.get("/google", catchAsync(initiateGoogleAuth));
router.get("/google/callback", catchAsync(googleAuthCallback));

// Token Management
router.post("/refresh", tokenLimiter, catchAsync(refresh));
router.post("/logout", catchAsync(logout));

// Protected Routes
router.get("/get-profile", authenticateToken, catchAsync(getProfile));

export default router;