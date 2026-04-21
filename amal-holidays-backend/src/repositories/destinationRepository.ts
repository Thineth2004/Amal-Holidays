import { pool } from "../config/db";

export const getAllDestinationsRepo = async () => {
    const result = await pool.query(`SELECT * FROM destination ORDER BY name ASC`);
    return result.rows;
};

export const createDestinationRepo = async (name: string, location: string, description: string) => {
    const result = await pool.query(
        `INSERT INTO destination (name, location, description) VALUES ($1, $2, $3) RETURNING *`,
        [name, location, description]
    );
    return result.rows[0];
};