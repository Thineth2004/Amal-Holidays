import { pool } from "../config/db";

// Create Tour
export const createPackageRepo = async (data: any) => {
    const {
        title,
        description,
        price,
        capacity,
        available_seats,
        start_date,
        end_date,
    } = data;

    const result = await pool.query(
        `INSERT INTO tour_package
        (title, description, duration, price, capacity, available_seats, start_date, end_date)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING *`,
        [title, description, price, capacity, available_seats, start_date, end_date]
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
            (tp.end_date - tp.start_date) AS duration
        FROM tour_package tp
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
