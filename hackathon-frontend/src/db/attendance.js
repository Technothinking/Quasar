import { execute, query } from './sqlite';
import { today, now } from '../utils/time';
import * as Crypto from 'expo-crypto';
import { addToOutbox } from './outbox';

/* =========================================================
   SUPERVISOR ATTENDANCE
   ========================================================= */

/* ---------- CHECK IN ---------- */
export const checkIn = async ({
  userId,
  projectId,
  role = 'supervisor',
  method = 'supervisor',
}) => {
  console.log('🔵 checkIn() START');

  const localId = Crypto.randomUUID();
  const date = today();
  const time = now();

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

  console.log('🟢 Supervisor attendance saved locally');

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

  console.log('📥 Supervisor check-in queued');

  return { offline: true };
};

/* ---------- CHECK OUT ---------- */
export const checkOut = async ({ userId }) => {
  console.log('🔵 checkOut() START');

  const time = now();
  const date = today();

  await execute(
    `UPDATE attendances
     SET check_out_time = ?, updated_at = ?
     WHERE user_id = ? AND date = ? AND role = 'supervisor'`,
    [time, time, userId, date]
  );

  console.log('🟢 Supervisor attendance updated locally');

  await addToOutbox('/attendance/check-out', 'POST', {
    user_id: userId,
    date,
    check_out_time: time,
  });

  console.log('📥 Supervisor check-out queued');

  return { offline: true };
};

/* =========================================================
   WORKER GPS ATTENDANCE (OFFLINE)
   ========================================================= */

export const workerToggleAttendance = async ({
  workerId,
  projectId,
  isCheckIn,
  latitude,
  longitude,
}) => {
  console.log(
    '🔵 workerToggleAttendance() START',
    latitude,
    longitude
  );

  const date = today();
  const time = now();

  /* ---------- CHECK IN ---------- */
  if (isCheckIn) {
    const localId = Crypto.randomUUID();

    await execute(
      `INSERT INTO attendances (
        local_id,
        project_id,
        user_id,
        role,
        date,
        check_in_time,
        latitude,
        longitude,
        method,
        status,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        localId,
        projectId,
        workerId,
        'worker',
        date,
        time,
        latitude,
        longitude,
        'gps',
        'present',
        time,
      ]
    );

    console.log('📍 WORKER SAVED LOCALLY:', latitude, longitude);

    await addToOutbox('/attendance/worker/check-in', 'POST', {
      id: localId,
      project_id: projectId,
      user_id: workerId,
      role: 'worker',
      date,
      check_in_time: time,
      latitude,
      longitude,
      status: 'present',
    });

    console.log('📥 Worker check-in queued');
  }

  /* ---------- CHECK OUT ---------- */
  else {
    await execute(
      `UPDATE attendances
       SET check_out_time = ?, updated_at = ?
       WHERE user_id = ? AND date = ? AND role = 'worker'`,
      [time, time, workerId, date]
    );

    console.log('🟢 Worker check-out saved locally');

    await addToOutbox('/attendance/worker/check-out', 'POST', {
      user_id: workerId,
      date,
      check_out_time: time,
    });

    console.log('📥 Worker check-out queued');
  }

  return { offline: true };
};

/* =========================================================
   READ HELPERS
   ========================================================= */

export const getTodayAttendance = async (userId) => {
  return await query(
    `SELECT * FROM attendances
     WHERE user_id = ? AND date = ?`,
    [userId, today()]
  );
};
