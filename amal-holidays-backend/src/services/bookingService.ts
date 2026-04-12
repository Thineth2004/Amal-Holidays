import { createBookingRepo } from "../repositories/bookingRepository";
import { getPackageByIdRepo } from "../repositories/tourRepository";

export const createBooking = async (data: any) => {
    const { package_id, travel_date } = data;

    // Get the tour package details
    const tour = await getPackageByIdRepo(package_id);

    if (!tour) {
        throw new Error("Tour package not found!");
    }

    const selectedDate = new Date(travel_date);
    const startDate = new Date(tour.start_date);
    const endDate = new Date(tour.end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates

    if (selectedDate < today) {
        throw new Error("You cannot book a tour for a past date.");
    }

    if (selectedDate < startDate || selectedDate > endDate) {
        throw new Error(
            `Invalid date. This tour is only available between ${startDate.toDateString} and ${endDate.toDateString}.`
        );
    }

    return await createBookingRepo(data);
}