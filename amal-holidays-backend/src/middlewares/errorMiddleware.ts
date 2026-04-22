import { Request, Response, NextFunction } from "express";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  console.error("ERROR:", err);

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message || "Something went wrong on the server",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};