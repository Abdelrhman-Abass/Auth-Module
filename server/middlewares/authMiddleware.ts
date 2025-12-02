import type { Response, NextFunction } from "express";
import { prisma } from "../prisma/client";
import { verifyAccessToken } from "../utils/tokensUtils";
import { UnauthorizedError, NotFoundError } from "../errors/AppError";
import type { AuthRequest } from "../Types/types";

export const authenticateToken = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return next(UnauthorizedError("Access token required"));
  }

  try {
    const { userId } = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return next(NotFoundError("User not found or inactive"));
    }

    req.userId = userId;
    return next();
  } catch (error) {
    return next(UnauthorizedError("Invalid or expired access token"));
  }
};