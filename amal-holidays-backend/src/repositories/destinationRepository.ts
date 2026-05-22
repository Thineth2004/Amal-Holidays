import { pool } from "../config/db";

export const getAllDestinationsRepo = async () => {
    // Left join calculates the lowest starting price dynamically from your tour_package table
    const query = `
      SELECT 
        d.destination_id,
        d.name,
        d.location,
        d.description,
        d.image_url,
        COALESCE(MIN(p.price), 0) AS "priceFrom",
        COALESCE(MAX(p.category), 'Adventure') AS category,
        4.9 AS rating -- Static or can be aggregated if you have reviews/ratings tables
      FROM destination d
      LEFT JOIN tour_package p ON d.destination_id = p.destination_id
      GROUP BY d.destination_id, d.name, d.location, d.description, d.image_url
      ORDER BY d.name ASC
    `;
    const result = await pool.query(query);
    return result.rows;
};

export const createDestinationRepo = async (name: string, location: string, description: string, image_url: string) => {
    const result = await pool.query(
        `INSERT INTO destination (name, location, description, image_url) VALUES ($1, $2, $3, $4) RETURNING *`,
        [name, location, description, image_url]
    );
    return result.rows[0];
};