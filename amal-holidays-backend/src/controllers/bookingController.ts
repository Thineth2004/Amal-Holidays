import { Response } from "express";
import { createBooking } from "../services/bookingService";
import { catchAsync } from "../utils/catchAsync"; 
import { AppError } from "../utils/AppError";     

export const createBookingController = catchAsync(async (req: any, res: Response) => {
    const { package_id, no_of_travelers, travel_date } = req.body;
    const tourist_id = req.user.user_id;

    const booking = await createBooking({
        tourist_id,
        package_id,
        no_of_travelers,
        travel_date,
    });

    if (!booking) {
        throw new AppError("Booking could not be finalized", 400);
    }

    res.status(201).json({
        success: true,
        message: "Booking confirmed successfully!",
        data: booking
    });
});