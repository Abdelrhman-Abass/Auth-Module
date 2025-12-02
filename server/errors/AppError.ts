import { HTTP_STATUS } from "../utils/constants";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = HTTP_STATUS.BAD_REQUEST) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true;
    this.name = "AppError";

    Error.captureStackTrace?.(this, this.constructor);
  }
}

export const BadRequestError = (message = "Bad Request") =>
  new AppError(message, HTTP_STATUS.BAD_REQUEST);

export const UnauthorizedError = (message = "Unauthorized") =>
  new AppError(message, HTTP_STATUS.UNAUTHORIZED);

export const ForbiddenError = (message = "Forbidden") =>
  new AppError(message, HTTP_STATUS.FORBIDDEN);

export const NotFoundError = (message = "Not Found") =>
  new AppError(message, HTTP_STATUS.NOT_FOUND);

export const ConflictError = (message = "Conflict") =>
  new AppError(message, HTTP_STATUS.CONFLICT);

export const InternalServerError = (message = "Internal Server Error") =>
  new AppError(message, HTTP_STATUS.INTERNAL_SERVER_ERROR);