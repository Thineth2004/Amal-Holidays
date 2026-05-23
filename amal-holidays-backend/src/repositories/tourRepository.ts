import { pool } from "../config/db";

// Create Tour
export const createPackageRepo = async (data: any) => {
    const {
        title,
        description,
        price,
        capacity,
        available_slots,
        destination_id,
        start_date,
        end_date,
        image_uuids,
    } = data;

    const result = await pool.query(
        `INSERT INTO tour_package
        (title, description, price, capacity, available_slots, destination_id, start_date, end_date, image_uuids)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *`,
        [title, description, price, capacity, available_slots, destination_id, start_date, end_date, JSON.stringify(image_uuids || [])]
    );

    return result.rows[0];
};

// Get all tours
export const getAllPackagesRepo = async () => {
    const result = await pool.query(
        `SELECT * FROM tour_package ORDER BY start_date ASC`
    );
    return result.rows;
};

// Get available tours
export const getAvailablePackagesRepo = async () => {
    const result = await pool.query(
        `SELECT
            tp.*,
            d.name AS destination_name,
            (tp.end_date - tp.start_date) AS duration
        FROM tour_package tp
        JOIN destination d
            ON tp.destination_id = d.destination_id
        WHERE tp.available_slots > 0
            AND tp.start_date >= CURRENT_DATE
        ORDER BY tp.start_date ASC
    `);
    
    return result.rows;
};

// Get single tour 
export const getPackageByIdRepo = async (id: number) => {
    const result = await pool.query(
        `SELECT * FROM tour_package WHERE package_id = $1`,
        [id]
    );
    return result.rows[0];
};

// Update tour package
export const updatePackageRepo = async (id: number, data: any) => {
    const {
        title,
        description,
        price,
        capacity,
        available_slots,
        destination_id,
        start_date,
        end_date,
        image_uuids,
    } = data;

    // We dynamically build the query based on whether image_uuids is provided
    let query = `UPDATE tour_package SET
        title = $1, description = $2, price = $3, capacity = $4,
        available_slots = $5, destination_id = $6, start_date = $7, end_date = $8`;
    const values = [title, description, price, capacity, available_slots, destination_id, start_date, end_date];

    if (image_uuids && image_uuids.length > 0) {
        query += `, image_uuids = $9 WHERE package_id = $10 RETURNING *`;
        values.push(JSON.stringify(image_uuids), id);
    } else {
        query += ` WHERE package_id = $9 RETURNING *`;
        values.push(id);
    }

    const result = await pool.query(query, values);
    return result.rows[0];
};

