import { Request, Response, NextFunction } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";

/**
 * Global error handler middleware
 * Handles Prisma, Zod, JWT, and custom errors with consistent format
 */
const errorHandler = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {

  try {
    // 1. Prisma Database Errors
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          const field = (error.meta?.['target'] as string[])?.[0] || "unknown";
          return res.status(409).json({
            success: false,
            message: "A record with this information already exists",
            field,
          });

        case "P2025": // Record not found
          return res.status(404).json({
            success: false,
            message: "Record not found",
          });

        case "P2003": // Foreign key constraint failed
          return res.status(400).json({
            success: false,
            message: "Invalid reference - related record does not exist",
          });

        default:
          return res.status(400).json({
            success: false,
            message: "Database operation failed",
            ...(process.env['NODE_ENV'] !== "production" && { code: error.code }),
          });
      }
    }

    // 2. Zod Validation Errors (from your validate middleware)
    if (error instanceof ZodError) {
      const errors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // 3. JWT Token Errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    // 4. Custom Application Errors (you can throw these in your code)
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message || "An error occurred",
      });
    }

    // 5. Default Server Error (hide details in production)
    return res.status(500).json({
      success: false,
      message:
        process.env['NODE_ENV'] === "production"
          ? "Internal server error"
          : error.message || "Something went wrong",
      ...(process.env['NODE_ENV'] !== "production" && { stack: error.stack }),
    });
  } catch (unexpectedError) {
    // Final safety net - never crash the server
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default errorHandler;