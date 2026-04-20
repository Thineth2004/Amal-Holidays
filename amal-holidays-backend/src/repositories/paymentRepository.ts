import { pool } from "../config/db";

export const createPaymentRepo = async (data: any) => {
    const { booking_id, amount, payment_method } = data;

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const result = await client.query(
            `INSERT INTO payment (booking_id, amount, payment_method, status)
            VALUES ($1, $2, $3, 'PAID')
            RETURNING *`,
            [booking_id, amount, payment_method]
        );

        await client.query(
            `UPDATE booking SET status = 'PAID' WHERE booking_id = $1`,
            [booking_id]
        );

        await client.query("COMMIT");
        return result.rows[0]
    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.release();
    }
};