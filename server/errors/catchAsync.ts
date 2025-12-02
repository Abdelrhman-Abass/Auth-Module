import type { Request, Response, NextFunction } from "express";
import { InternalServerError } from "../errors/AppError";

export const catchAsync = <
  Req extends Request = Request,
  Res extends Response = Response
>(
  fn: (req: Req, res: Res, next: NextFunction) => Promise<any>
) => {
  return (req: Req, res: Res, next: NextFunction) => {
    fn(req, res, next).catch((err) =>
      next(
        err.isOperational
          ? err
          : InternalServerError(err?.message || "Something went wrong")
      )
    );
  };
};