import { pool } from "../config/db";

export const createInquiryRepo = async (data: { name: string, contact: string, subject: string, content: string }) => {
    const { name, contact, subject, content } = data;
    const result = await pool.query(
        `INSERT INTO inquiry (name, contact, subject, content, status)
         VALUES ($1, $2, $3, $4, 'Pending')
         RETURNING *`,
        [name, contact, subject, content]
    );
    return result.rows[0];
};

export const getAllInquiriesRepo = async () => {
    const result = await pool.query(
        `SELECT * FROM inquiry ORDER BY created_at DESC`
    );
    return result.rows;
};

export const markAsReviewedRepo = async (id: number) => {
    const result = await pool.query(
        `UPDATE inquiry SET status = 'Reviewed' WHERE inquiry_id = $1 RETURNING *`,
        [id]
    );
    return result.rows[0];
};
