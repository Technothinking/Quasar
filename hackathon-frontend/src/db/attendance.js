import { execute, query } from './sqlite';
import { today, now } from '../utils/time';
import * as Crypto from 'expo-crypto';
import { addToOutbox } from './outbox';

/* ---------- CHECK IN ---------- */

export const checkIn = async ({
  userId,
  projectId,
  role = 'supervisor',
  method = 'supervisor',
}) => {
  console.log('🔵 checkIn() START');

  try {
    const localId = Crypto.randomUUID();
    const date = today();
    const time = now();

    // 1️⃣ Save locally
    await execute(
      `INSERT INTO attendances (
        local_id,
        project_id,
        user_id,
        role,
        date,
        check_in_time,
        method,
        status,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        localId,
        projectId,
        userId,
        role,
        date,
        time,
        method,
        'present',
        time,
      ]
    );

    console.log('🟢 Attendance saved locally');

    // 2️⃣ Queue for sync
    await addToOutbox('/attendance/check-in', 'POST', {
      id: localId,
      project_id: projectId,
      user_id: userId,
      role,
      date,
      check_in_time: time,
      method,
      status: 'present',
    });

    console.log('📥 Attendance check-in queued');

    return { offline: true };
  } catch (e) {
    console.log('🔴 ERROR in checkIn()', e);
    throw e;
  }
};

/* ---------- CHECK OUT ---------- */

export const checkOut = async ({ userId }) => {
  console.log('🔵 checkOut() START');

  try {
    const time = now();
    const date = today();

    await execute(
      `UPDATE attendances
       SET check_out_time = ?, updated_at = ?
       WHERE user_id = ? AND date = ?`,
      [time, time, userId, date]
    );

    console.log('🟢 Attendance updated locally');

    await addToOutbox('/attendance/check-out', 'POST', {
      user_id: userId,
      date,
      check_out_time: time,
    });

    console.log('📥 Attendance check-out queued');

    return { offline: true };
  } catch (e) {
    console.log('🔴 ERROR in checkOut()', e);
    throw e;
  }
};

/* ---------- READ ---------- */

export const getTodayAttendance = async (userId) => {
  return await query(
    `SELECT * FROM attendances
     WHERE user_id = ? AND date = ?`,
    [userId, today()]
  );
};
