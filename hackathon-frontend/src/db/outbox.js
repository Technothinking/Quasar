import { getDB } from './sqlite';
import * as Crypto from 'expo-crypto';

export const addToOutbox = async (endpoint, method, payload) => {
  const db = await getDB();

  await db.runAsync(
    `INSERT INTO outbox (id, endpoint, method, payload, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      Crypto.randomUUID(),
      endpoint,
      method,
      JSON.stringify(payload),
      'PENDING',
      Date.now(),
    ]
  );
};

export const getOutbox = async () => {
  const db = await getDB();
  return await db.getAllAsync(`SELECT * FROM outbox`);
};
