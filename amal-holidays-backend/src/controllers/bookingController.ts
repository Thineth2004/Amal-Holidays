import { Response } from "express";
import { createBooking, deleteBooking } from "../services/bookingService";
import { getAllBookingsRepo } from "../repositories/bookingRepository";
import { catchAsync } from "../utils/catchAsync"; 
import { AppError } from "../utils/AppError";

export const getAllBookingsController = catchAsync(async (req: any, res: Response) => {
    const bookings = await getAllBookingsRepo();
    
    res.status(200).json({
        success: true,
        data: bookings
    });
});

export const createBookingController = catchAsync(async (req: any, res: Response) => {
    const { 
        package_id, 
        no_of_travelers, 
        travel_date,
        hotel_id,
        hotel_rooms,
        hotel_cost,
        driver_id,
        driver_cost,
        tour_guide_id,
        tour_guide_cost,
        total_price
    } = req.body;
    const tourist_id = req.user.user_id;

    const booking = await createBooking({
        tourist_id,
        package_id,
        no_of_travelers,
        travel_date,
        hotel_id,
        hotel_rooms,
        hotel_cost,
        driver_id,
        driver_cost,
        tour_guide_id,
        tour_guide_cost,
        total_price
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

export const deleteBookingController = catchAsync(async (req: any, res: Response) => {
    const bookingId = Number(req.params.id);

    if (isNaN(bookingId)) {
        throw new AppError('Invalid booking id', 400);
    }

    await deleteBooking(bookingId);

    res.status(200).json({
        success: true,
        message: 'Booking deleted successfully'
    });
});
