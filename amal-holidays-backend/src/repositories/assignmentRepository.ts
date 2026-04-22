import { pool } from "../config/db";

export const getBookingDateRepo = async (booking_id: number) => {
  const result = await pool.query(
    "SELECT travel_date FROM booking WHERE booking_id = $1", 
    [booking_id]
  );
  return result.rows[0]?.travel_date;
};

export const checkStaffAvailabilityRepo = async (staff_id: number, travel_date: string, role: 'Guide' | 'Driver') => {
  const tableName = role === 'Guide' ? 'guide_assignment' : 'driver_assignment';
  const idColumn = role === 'Guide' ? 'guide_id' : 'driver_id';

  const query = `
    SELECT a.* 
    FROM ${tableName} a
    JOIN booking b ON a.booking_id = b.booking_id
    WHERE a.${idColumn} = $1 AND b.travel_date = $2
  `;
  
  const result = await pool.query(query, [staff_id, travel_date]);
  return result.rows.length === 0; 
};

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