// middlewares/validationMiddleware.ts

import type { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { createErrorResponse } from "../utils/helpers";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.safeParse(req.body ?? {});

      if (parsed.success) {
        req.body = parsed.data;
        return next();
      }

      const formattedErrors = parsed.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return res.status(400).json(
        createErrorResponse("Validation failed", {
          issues: formattedErrors,
        })
      ); // REQUIRED for tests to detect error
    } catch {
      return res
        .status(400)
        .json(createErrorResponse("Invalid request data"));
    }
  };
};
