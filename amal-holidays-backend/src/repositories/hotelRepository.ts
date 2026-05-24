import { pool } from "../config/db";

export const getAllHotels = async () => {
    const result = await pool.query(
        `SELECT * FROM hotel ORDER BY hotel_id DESC`
    );
    return result.rows;
};

export const getHotelById = async (id: number) => {
    const result = await pool.query(
        `SELECT * FROM hotel WHERE hotel_id = $1`,
        [id]
    );
    return result.rows[0];
};

export const createHotel = async (
    name: string,
    location: string,
    contact_no: string,
    rating: number,
    description: string,
    image_uuid: string,
    price_per_night: number
) => {
    // We will store price_per_night in room_type table, so we need to do a transaction
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const hotelResult = await client.query(
            `INSERT INTO hotel (name, location, contact_no, rating, description, image_uuid)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [name, location, contact_no, rating, description, image_uuid]
        );
        const hotel = hotelResult.rows[0];

        await client.query(
            `INSERT INTO room_type (type_name, price_per_night, hotel_id)
            VALUES ($1, $2, $3)`,
            ['Standard Room', price_per_night, hotel.hotel_id]
        );

        await client.query('COMMIT');
        return { ...hotel, price_per_night };
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};

export const updateHotel = async (
    id: number,
    name: string,
    location: string,
    contact_no: string,
    rating: number,
    description: string,
    image_uuid: string,
    price_per_night: number
) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const hotelResult = await client.query(
            `UPDATE hotel
            SET name = $1, location = $2, contact_no = $3, rating = $4, description = $5, image_uuid = $6
            WHERE hotel_id = $7
            RETURNING *`,
            [name, location, contact_no, rating, description, image_uuid, id]
        );

        await client.query(
            `UPDATE room_type
            SET price_per_night = $1
            WHERE hotel_id = $2 AND type_name = 'Standard Room'`,
            [price_per_night, id]
        );

        await client.query('COMMIT');
        return { ...hotelResult.rows[0], price_per_night };
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};

export const deleteHotel = async (id: number) => {
    const result = await pool.query(
        `DELETE FROM hotel WHERE hotel_id = $1 RETURNING *`,
        [id]
    );
    return result.rows[0];
};

export const getHotelBookings = async (id: number) => {
    const result = await pool.query(
        `SELECT hr.reservation_id, hr.check_in, hr.check_out, hr.status as reservation_status, hr.rooms_count,
            b.booking_id, b.booking_date, b.travel_date, b.no_of_travelers, b.status, b.tourist_id, b.package_id, b.total_price,
            u.name as tourist_name, u.email as tourist_email,
            tp.title as package_title, tp.price as package_price,
            rt.price_per_night as hotel_price,
            du.price_per_day as driver_price,
            gu.price_per_day as guide_price
        FROM hotel_reservation hr
        JOIN room_type rt ON hr.room_type_id = rt.room_type_id
        JOIN booking b ON hr.booking_id = b.booking_id
        JOIN users u ON b.tourist_id = u.user_id
        JOIN tour_package tp ON b.package_id = tp.package_id
        LEFT JOIN driver_assignment da ON b.booking_id = da.booking_id
        LEFT JOIN users du ON da.driver_id = du.user_id
        LEFT JOIN guide_assignment ga ON b.booking_id = ga.booking_id
        LEFT JOIN users gu ON ga.guide_id = gu.user_id
        WHERE rt.hotel_id = $1
        ORDER BY hr.check_in DESC`,
        [id]
    );
    return result.rows;
};

export const getHotelWithPrice = async () => {
    const result = await pool.query(
        `SELECT h.*, rt.price_per_night, rt.room_type_id
        FROM hotel h
        LEFT JOIN room_type rt ON h.hotel_id = rt.hotel_id AND rt.type_name = 'Standard Room'
        ORDER BY h.hotel_id DESC`
    );
    return result.rows;
};
