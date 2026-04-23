import { Request, Response, NextFunction } from "express";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = '${err.statusCode}'.startsWith('4') ? 'fail': 'error';

  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      console.error("NON-OPERATIONAL ERROR:", err);

      res.status(500).json({
        status: "error",
        message: "Oops...Something went wrong!"
      });
    }
  }
};