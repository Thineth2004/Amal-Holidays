import { Response } from "express";
import { createBooking } from "../services/bookingService";

export const createBookingController = async (req: any, res: Response) => {
    try {
        const { package_id, no_of_travelers, travel_date } = req.body;
        const tourist_id = req.user.user_id;

        const booking = await createBooking({
            tourist_id,
            package_id,
            no_of_travelers,
            travel_date,
        });

        res.status(201).json({
            success: true,
            message: "Booking confirmed successfully!",
            data: booking
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to create booking"
        });
    }
};