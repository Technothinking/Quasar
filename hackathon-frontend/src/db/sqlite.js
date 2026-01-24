import * as SQLite from 'expo-sqlite';

let db = null;

/* ===============================
   DB CONNECTION
   =============================== */

export const getDB = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('constructpro-offline.db');
    console.log('🧠 SQLite DB opened');
  }
  return db;
};

export const resetDBConnection = async () => {
  db = null;
  console.log('🔁 SQLite DB connection reset');
};

/* ===============================
   INIT DB + SCHEMA
   =============================== */

export const initDB = async () => {
  // 🔥 IMPORTANT: reset cached DB so schema changes apply
  await resetDBConnection();
  const database = await getDB();

  await database.execAsync(`
    /* ---------- OUTBOX ---------- */
    CREATE TABLE IF NOT EXISTS outbox (
      id TEXT PRIMARY KEY,
      endpoint TEXT NOT NULL,
      method TEXT NOT NULL,
      payload TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    /* ---------- ATTENDANCES ---------- */
    CREATE TABLE IF NOT EXISTS attendances (
      local_id TEXT PRIMARY KEY,
      project_id INTEGER,
      user_id TEXT,
      role TEXT,                     -- supervisor | worker
      date TEXT,

      check_in_time TEXT,
      check_out_time TEXT,

      latitude REAL,
      longitude REAL,

      method TEXT,                   -- supervisor | gps
      status TEXT,
      sync_status TEXT DEFAULT 'PENDING',

      created_at TEXT,
      updated_at TEXT
    );

    /* ---------- WORKER UPDATES (VOICE / MANUAL) ---------- */
    DROP TABLE IF EXISTS worker_updates;

    CREATE TABLE worker_updates (
      local_id TEXT PRIMARY KEY,
      project_id INTEGER,
      worker_id TEXT,
      date TEXT,

      work_done TEXT,
      location_text TEXT,
      photo_uri TEXT,

      sync_status TEXT DEFAULT 'PENDING',
      created_at TEXT
    );

    /* ---------- DPR ---------- */
    CREATE TABLE IF NOT EXISTS dprs (
      local_id TEXT PRIMARY KEY,
      project_id INTEGER,
      user_id TEXT,
      date TEXT,

      stage TEXT,
      other_note TEXT,
      work_status TEXT,
      issues TEXT,
      issue_note TEXT,

      sync_status TEXT DEFAULT 'PENDING',
      created_at TEXT,
      updated_at TEXT
    );
  `);

  console.log('📦 SQLite tables ready');
};

/* ===============================
   QUERY HELPERS
   =============================== */

export const execute = async (sql, params = []) => {
  const database = await getDB();
  return await database.runAsync(sql, params);
};

export const query = async (sql, params = []) => {
  const database = await getDB();
  return await database.getAllAsync(sql, params);
};
