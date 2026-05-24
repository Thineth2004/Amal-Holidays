import { pool } from "../config/db";

export const getAllBookingsRepo = async () => {
    try {
        const result = await pool.query(
            `SELECT b.booking_id, b.booking_date, b.travel_date, b.no_of_travelers, b.status, b.tourist_id, b.package_id, b.total_price,
            tp.price as package_price,
            rt.price_per_night as hotel_price,
            hr.rooms_count as hotel_rooms_count,
            du.price_per_day as driver_price,
            gu.price_per_day as guide_price
            FROM booking b
            LEFT JOIN tour_package tp ON b.package_id = tp.package_id
            LEFT JOIN hotel_reservation hr ON b.booking_id = hr.booking_id
            LEFT JOIN room_type rt ON hr.room_type_id = rt.room_type_id
            LEFT JOIN driver_assignment da ON b.booking_id = da.booking_id
            LEFT JOIN users du ON da.driver_id = du.user_id
            LEFT JOIN guide_assignment ga ON b.booking_id = ga.booking_id
            LEFT JOIN users gu ON ga.guide_id = gu.user_id
            ORDER BY b.booking_date DESC`
        );
        return result.rows;
    } catch (error) {
        throw error;
    }
};

export const createBookingRepo = async (data: any) => {
    const client = await pool.connect();

    try {
        const {
            tourist_id,
            package_id,
            no_of_travelers,
            travel_date,
            hotel_id,
            hotel_rooms,
            driver_id,
            tour_guide_id,
            total_price
        } = data;

        await client.query("BEGIN");

        // Lock row to prevent race conditions
        const packageResult = await client.query(
            `SELECT available_slots, price
            FROM tour_package
            WHERE package_id = $1
            FOR UPDATE`,
            [package_id]
        );

        const pkg = packageResult.rows[0];

        if (!pkg) {
            throw new Error("Package not found");
        }

        if (pkg.available_slots < no_of_travelers) {
            throw new Error("Not enough slots available");
        }

        const final_price = total_price || (pkg.price * no_of_travelers);

        // Insert booking
        const bookingResult = await client.query(
            `INSERT INTO booking
            (travel_date, no_of_travelers, status, tourist_id, package_id, total_price)
            VALUES ($1,$2,'Pending',$3,$4,$5)
            RETURNING *`,
            [travel_date, no_of_travelers, tourist_id, package_id, final_price]
        );

        const booking_id = bookingResult.rows[0].booking_id;

        if (hotel_id) {
            // Find room_type_id for the hotel
            const roomResult = await client.query(
                `SELECT room_type_id FROM room_type WHERE hotel_id = $1 LIMIT 1`,
                [hotel_id]
            );
            if (roomResult.rows[0]) {
                const room_type_id = roomResult.rows[0].room_type_id;
                // Get check_out by adding duration of package to travel_date
                // For simplicity, add 1 day
                await client.query(
                    `INSERT INTO hotel_reservation (check_in, check_out, status, booking_id, room_type_id, rooms_count)
                    VALUES ($1, $1::date + interval '1 day', 'Reserved', $2, $3, $4)`,
                    [travel_date, booking_id, room_type_id, hotel_rooms || 1]
                );
            }
        }

        if (driver_id) {
            await client.query(
                `INSERT INTO driver_assignment (driver_id, booking_id)
                VALUES ($1, $2)`,
                [driver_id, booking_id]
            );
        }

        if (tour_guide_id) {
            await client.query(
                `INSERT INTO guide_assignment (guide_id, booking_id)
                VALUES ($1, $2)`,
                [tour_guide_id, booking_id]
            );
        }

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

export const deleteBookingRepo = async (bookingId: number) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const bookingResult = await client.query(
            `SELECT booking_id, no_of_travelers, package_id
             FROM booking
             WHERE booking_id = $1
             FOR UPDATE`,
            [bookingId]
        );

        const booking = bookingResult.rows[0];

        if (!booking) {
            throw new Error('Booking not found');
        }

        // Delete booking
        await client.query(`DELETE FROM booking WHERE booking_id = $1`, [bookingId]);

        // Restore available slots to the package
        await client.query(
            `UPDATE tour_package
             SET available_slots = available_slots + $1
             WHERE package_id = $2`,
            [booking.no_of_travelers, booking.package_id]
        );

        await client.query('COMMIT');

        return booking;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};
