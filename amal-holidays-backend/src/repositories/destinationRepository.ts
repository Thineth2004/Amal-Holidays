import { pool } from "../config/db";

export const getAllDestinationsRepo = async () => {
    const result = await pool.query(`SELECT * FROM destination ORDER BY name ASC`);
    return result.rows;
};

export const createDestinationRepo = async (name: string, location: string, description: string, image_uuid: string) => {
    const result = await pool.query(
        `INSERT INTO destination (name, location, description, image_uuid) VALUES ($1, $2, $3, $4) RETURNING *`,
        [name, location, description, image_uuid]
    );
    return result.rows[0];
};
