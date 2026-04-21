import { pool } from "../config/db";

export const getAllDestinationsRepo = async () => {
    const result = await pool.query(`SELECT * FROM destination`);
    return result.rows;
};

export const createDestinationRepo = async (name: string) => {
    const result = await pool.query(
        `INSERT INTO destination (name) VALUES ($1) RETURNING *`,
        [name]
    );
    return result.rows[0];
};