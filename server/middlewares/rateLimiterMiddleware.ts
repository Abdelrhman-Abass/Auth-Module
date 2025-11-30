import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import { HTTP_STATUS } from "../utils/constants";


export const authLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 20, // Max 20 auth attempts per IP 
  standardHeaders: true, 
  legacyHeaders: false, 
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
    retryAfter: "15 minutes",
  },
 
  handler: (req, res) => {
    console.warn(`Rate limit exceeded for IP: ${req.ip} on ${req.originalUrl}`);
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      message: "Too many authentication attempts. Please try again later.",
      retryAfter: "15 minutes",
    });
  },
});


/**
 * General limiter for all other routes
 * Protects against DDoS/abuse on non-auth endpoints
 */
export const generalLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Allow 200 requests per IP — generous but safe
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please slow down.",
  },
  handler: (req, res) => {
    console.warn(`General rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: "Too many requests. Please slow down.",
      retryAfter: "15 minutes",
    });
  },
});

/**
 * Ultra-strict limiter 
 * These should be very rare per user
 */
export const tokenLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Max 10 refresh/logout attempts per hour
  message: {
    success: false,
    message: "Too many token operations. Please wait before trying again.",
  },
});