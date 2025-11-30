import type { Request, Response, NextFunction } from "express";
import { InternalServerError } from "./AppError";

/**
 * Automatically wraps async errors and passes to errorHandler
 */
export const catchAsync = <
  Req extends Request = Request,
  Res extends Response = Response
>(
  fn: (req: Req, res: Res, next: NextFunction) => Promise<any>
) => {
  return (req: Req, res: Res, next: NextFunction) => {
    fn(req, res, next).catch((error) => {
      // Convert any error into a trusted AppError
      const appError = error.isOperational
        ? error // Already a trusted error
        : InternalServerError(
            error?.message || "Internal server error",
          );

      next(appError);
    });
  };
};