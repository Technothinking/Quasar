import * as SQLite from 'expo-sqlite';

let db = null;

export const getDB = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('constructpro-offline.db');
  }
  return db;
};

export const execute = async (query, params = []) => {
  const database = await getDB();
  return await database.runAsync(query, params);
};

export const query = async (query, params = []) => {
  const database = await getDB();
  const result = await database.getAllAsync(query, params);
  return result;
};
