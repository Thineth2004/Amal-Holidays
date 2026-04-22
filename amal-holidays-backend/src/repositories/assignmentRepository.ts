import { pool } from "../config/db";

export const assignGuideRepo = async (booking_id: number, guide_id: number) => {
    const result = await pool.query(
        `INSERT INTO guide_assignment (booking_id, guide_id)
        VALUES ($1, $2)
        RETURNING *`,
        [booking_id, guide_id]
    );
    return result.rows[0];
};

export const assignDriverRepo = async (booking_id: number, driver_id: number) => {
    const result = await pool.query(
        `INSERT INTO driver_assignment (booking_id, driver_id)
        VALUES ($1, $2)
        RETURNING *`,
        [booking_id, driver_id]
    );
    return result.rows[0];
};

export const getStaffByRoleRepo = async (role: string) => {
    const result = await pool.query(
        `SELECT user_id, name, email FROM users WHERE role = $1`,
        [role]
    );
    return result.rows;
};