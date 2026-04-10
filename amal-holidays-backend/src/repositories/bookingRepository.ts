import { pool } from "../config/db";

export const createBookingRepo = async (data: any) => {
    const client = await pool.connect();

    try {
        const {
            tourist_id,
            package_id,
            no_of_travelers,
            travel_date,
        } = data;

        await client.query("BEGIN");

        // Lock row to prevent race conditions
        const packageResult = await client.query(
            `SELECT available_slots, price
            FROM tour_package
            WHERE package_id = $1
            FROM UPDATE`,
            [package_id]
        );

        const pkg = packageResult.rows[0];

        if (!pkg) {
            throw new Error("Package not found");
        }

        if (pkg.available_slots < no_of_travelers) {
            throw new Error("Not enough slots available");
        }

        const total_price = pkg.price * no_of_travelers;

        // Insert booking
        const bookingResult = await client.query(
            `INSERT INTO booking
            (travel_date, no_of_travelers, status, tourist_id, package_id, total_price)
            VALUES ($1,$2,'CONFIRMED',$3,$4,$5)
            RETURNING *`,
            [travel_date, no_of_travelers, tourist_id, package_id, total_price]
        );

        await client.query(
            `UPDATE tour_package
            SET available_slots = available_slots - $1
            WHERE package_id = $2`,
            [no_of_travelers, package_id]
        );

        await client.query("COMMIT");

        return bookingResult.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};
