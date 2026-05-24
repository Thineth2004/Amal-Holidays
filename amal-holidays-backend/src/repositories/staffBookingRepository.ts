import { pool } from "../config/db";

export const getDriverBookings = async (id: number) => {
    const result = await pool.query(
        `SELECT da.driver_assignment_id, da.assigned_date,
            b.booking_id, b.booking_date, b.travel_date, b.no_of_travelers, b.status, b.tourist_id, b.package_id, b.total_price,
            u.name as tourist_name, u.email as tourist_email,
            tp.title as package_title, tp.price as package_price,
            rt.price_per_night as hotel_price,
            hr.rooms_count as hotel_rooms_count,
            du.price_per_day as driver_price,
            gu.price_per_day as guide_price
        FROM driver_assignment da
        JOIN booking b ON da.booking_id = b.booking_id
        JOIN users u ON b.tourist_id = u.user_id
        JOIN tour_package tp ON b.package_id = tp.package_id
        JOIN users du ON da.driver_id = du.user_id
        LEFT JOIN hotel_reservation hr ON b.booking_id = hr.booking_id
        LEFT JOIN room_type rt ON hr.room_type_id = rt.room_type_id
        LEFT JOIN guide_assignment ga ON b.booking_id = ga.booking_id
        LEFT JOIN users gu ON ga.guide_id = gu.user_id
        WHERE da.driver_id = $1
        ORDER BY b.travel_date DESC`,
        [id]
    );
    return result.rows;
};

export const getGuideBookings = async (id: number) => {
    const result = await pool.query(
        `SELECT ga.guide_assignment_id, ga.assigned_date,
            b.booking_id, b.booking_date, b.travel_date, b.no_of_travelers, b.status, b.tourist_id, b.package_id, b.total_price,
            u.name as tourist_name, u.email as tourist_email,
            tp.title as package_title, tp.price as package_price,
            rt.price_per_night as hotel_price,
            hr.rooms_count as hotel_rooms_count,
            du.price_per_day as driver_price,
            gu.price_per_day as guide_price
        FROM guide_assignment ga
        JOIN booking b ON ga.booking_id = b.booking_id
        JOIN users u ON b.tourist_id = u.user_id
        JOIN tour_package tp ON b.package_id = tp.package_id
        JOIN users gu ON ga.guide_id = gu.user_id
        LEFT JOIN hotel_reservation hr ON b.booking_id = hr.booking_id
        LEFT JOIN room_type rt ON hr.room_type_id = rt.room_type_id
        LEFT JOIN driver_assignment da ON b.booking_id = da.booking_id
        LEFT JOIN users du ON da.driver_id = du.user_id
        WHERE ga.guide_id = $1
        ORDER BY b.travel_date DESC`,
        [id]
    );
    return result.rows;
};
