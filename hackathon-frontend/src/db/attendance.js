import { execute, query } from './sqlite';
import { today, now } from '../utils/time';
import { v4 as uuidv4 } from 'uuid';

/* ---------- CHECK IN ---------- */

export const checkIn = async ({
  userId,
  projectId,
  role = 'supervisor',
  method = 'supervisor',
}) => {
  return await execute(
    `INSERT INTO attendances (
      local_id,
      project_id,
      user_id,
      role,
      date,
      check_in_time,
      method,
      status,
      sync_status,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      uuidv4(),
      projectId,
      userId,
      role,
      today(),
      now(),
      method,
      'present',
      'pending',
      now(),
    ]
  );
};

/* ---------- CHECK OUT ---------- */

export const checkOut = async (userId) => {
  return await execute(
    `UPDATE attendances
     SET check_out_time = ?, updated_at = ?, sync_status = 'pending'
     WHERE user_id = ? AND date = ?`,
    [now(), now(), userId, today()]
  );
};

/* ---------- READ ---------- */

export const getTodayAttendance = async (userId) => {
  return await query(
    `SELECT * FROM attendances
     WHERE user_id = ? AND date = ?`,
    [userId, today()]
  );
};
