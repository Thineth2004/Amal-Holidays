import { pool } from "../config/db";
import { createPaymentRepo } from "../repositories/paymentRepository";

export const createPayment = async (data: any) => {
    const { booking_id, amount } = data;

    const result = await pool.query(
        `SELECT total_price, status FROM booking WHERE booking_id = $1`,
        [booking_id]
    );   

    const booking = result.rows[0];

    if (!booking) throw new Error("Booking not found");

    if (booking.status === 'PAID') {
        throw new Error("This booking has already been paid for.");
    }

    if (Number(amount) !== Number(booking.total_price)) {
        throw new Error(`Incorrect amount. Expected: ${booking.total_price} LKR`);
    }

    return await createPaymentRepo(data);
};