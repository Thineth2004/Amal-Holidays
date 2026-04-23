import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const validateBookingInput = (req: Request, res: Response, next: NextFunction) => {
  const { package_id, no_of_travelers, travel_date } = req.body;

  if (!package_id || !no_of_travelers || !travel_date) {
    return next(new AppError("Please provide package_id, no_of_travelers, and travel_date", 400));
  }

  if (typeof no_of_travelers !== 'number' || no_of_travelers <= 0) {
    return next(new AppError("Number of travelers must be a positive number", 400));
  }

  const selectedDate = new Date(travel_date);
  const today = new Date();
  if (selectedDate < today) {
    return next(new AppError("Travel date cannot be in the past", 400));
  }

  next(); 
};