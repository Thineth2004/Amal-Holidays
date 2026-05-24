import { pool } from "../config/db";

export const getAllUsers = async () => {
    try {
        const result = await pool.query(
            `SELECT user_id, name, email, phone, role, status, created_at, price_per_day, image_uuid
            FROM users
            ORDER BY created_at DESC`
        );
        return result.rows;
    } catch (error) {
        throw error;
    }
};

export const getUsersByRole = async (role: string) => {
    try {
        const result = await pool.query(
            `SELECT user_id, name, email, phone, role, status, created_at, price_per_day, image_uuid
            FROM users
            WHERE role = $1
            ORDER BY created_at DESC`,
            [role]
        );
        return result.rows;
    } catch (error) {
        throw error;
    }
};

export const getUserById = async (id: number) => {
    try {
        const result = await pool.query(
            `SELECT user_id, name, email, phone, role, status, created_at, price_per_day, image_uuid
            FROM users
            WHERE user_id = $1`,
            [id]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

export const findUserByEmail = async (email: string) => {
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );
    return result.rows[0];
}

export const createUser = async (
    name: string,
    email: string,
    password: string,
    role: string
) => {
    const result = await pool.query(
        `INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [name, email, password, role]
    );
    return result.rows[0];
};

export const createStaff = async (
    name: string,
    email: string,
    password: string,
    role: string,
    phone: string,
    price_per_day: number,
    image_uuid: string
) => {
    const result = await pool.query(
        `INSERT INTO users (name, email, password, role, phone, price_per_day, image_uuid)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [name, email, password, role, phone, price_per_day, image_uuid]
    );
    return result.rows[0];
};

export const updateStaff = async (
    id: number,
    name: string,
    email: string,
    phone: string,
    price_per_day: number,
    image_uuid: string
) => {
    const result = await pool.query(
        `UPDATE users
        SET name = $1, email = $2, phone = $3, price_per_day = $4, image_uuid = $5
        WHERE user_id = $6
        RETURNING *`,
        [name, email, phone, price_per_day, image_uuid, id]
    );
    return result.rows[0];
};

export const deleteUser = async (id: number) => {
    const result = await pool.query(
        `DELETE FROM users WHERE user_id = $1 RETURNING *`,
        [id]
    );
    return result.rows[0];
};
