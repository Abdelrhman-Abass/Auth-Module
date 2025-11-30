
import type {
  
  NextFunction,
  Response
} from "express";

import { prisma } from "../prisma/client";
import {
  verifyAccessToken,
} from "../utils/tokensUtils";

import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/AppError";
import { AuthRequest } from "../Types/types";


export const authenticateToken = async (req:AuthRequest, _res: Response, next:NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return next(BadRequestError('Access token required'));
    }
  
  
  
    try {
      const { userId } = verifyAccessToken(token);

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return next(NotFoundError('Invalid or inactive user'));
      }

      req.userId = userId;
      next();
    } catch (error) {
      return next(UnauthorizedError('Invalid or expired access token'));
    }

  };