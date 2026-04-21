import { pool } from "../config/db";

// Total revenue
export const getTotalRevenueRepo = async () => {
    const result = await pool.query(
        `SELECT SUM(amount) as total_revenue
        FROM payment
        WHERE status = 'PAID'`
    );
    return result.rows[0];
};

// Monthly revenue
export const getMonthlyRevenueRepo = async () => {
    const result = await pool.query(
        `SELECT 
            DATE_TRUNC('month', created_at) AS month,
            SUM(amount) as monthly_revenue
        FROM payment
        WHERE status = 'PAID'
        GROUP BY month
        ORDER BY month`
    );
    return result.rows;
};

// Popular packages
export const getPopularPackagesRepo = async () => {
    const result = await pool.query(
        `SELECT 
            tp.title,
            SUM(no_of_travelers) AS total_travelers
        FROM booking b
        JOIN tour_package tp ON b.package_id = tp.package_id
        GROUP BY tp.title
        ORDER BY total_travelers DESC`
    );
    return result.rows;
};

// Booking count per package
export const getBookingCountRepo = async () => {
    const result = await pool.query(
        `SELECT
            tp.title
            SUM(b.booking_id) AS total_bookings
        FROM booking b
        JOIN tour_package tp ON b.package_id = tp.package_id
        GROUP BY tp.title`
    );
};