import * as SQLite from 'expo-sqlite';

let db = null;

export const getDB = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('constructpro-offline.db');
  }
  return db;
};

export const initDB = async () => {
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

    /* ---------- ATTENDANCES (Supervisor + Worker) ---------- */
    CREATE TABLE IF NOT EXISTS attendances (
      local_id TEXT PRIMARY KEY,
      project_id INTEGER,
      user_id TEXT,
      role TEXT,                    -- supervisor | worker
      date TEXT,
      check_in_time TEXT,
      check_out_time TEXT,

      latitude TEXT,                -- for workers (nullable)
      longitude TEXT,               -- for workers (nullable)

      method TEXT,
      status TEXT,
      sync_status TEXT DEFAULT 'PENDING',

      created_at TEXT,
      updated_at TEXT
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

export const execute = async (query, params = []) => {
  const database = await getDB();
  return await database.runAsync(query, params);
};

export const query = async (queryText, params = []) => {
  const database = await getDB();
  return await database.getAllAsync(queryText, params);
};
