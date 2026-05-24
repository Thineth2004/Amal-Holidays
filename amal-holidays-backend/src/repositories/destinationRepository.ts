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

export const updateDestinationRepo = async (
    id: number,
    name: string,
    location: string,
    description: string,
    image_uuid?: string
) => {
    const values: any[] = [name, location, description];
    let query = `UPDATE destination SET name = $1, location = $2, description = $3`;

    if (image_uuid) {
        query += `, image_uuid = $4 WHERE destination_id = $5 RETURNING *`;
        values.push(image_uuid, id);
    } else {
        query += ` WHERE destination_id = $4 RETURNING *`;
        values.push(id);
    }

    const result = await pool.query(query, values);
    return result.rows[0];
};

export const deleteDestinationRepo = async (id: number) => {
    const result = await pool.query(
        `DELETE FROM destination WHERE destination_id = $1 RETURNING *`,
        [id]
    );
    if (!result.rows[0]) {
        throw new Error("Destination not found.");
    }
    return result.rows[0];
};
