import * as SQLite from 'expo-sqlite';
import { v4 as uuidv4 } from 'uuid';

const db = SQLite.openDatabase('constructpro_offline.db');

export const OfflineDB = {

  executeSql: (query, params = []) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          query,
          params,
          (_, result) => resolve(result),
          (_, error) => reject(error)
        );
      });
    });
  },

  insertRecord: async (table, data) => {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);
    await OfflineDB.executeSql(
      `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
      values
    );
  },

  updateRecord: async (table, data, localId) => {
    const setString = Object.keys(data).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(data), localId];
    await OfflineDB.executeSql(
      `UPDATE ${table} SET ${setString} WHERE local_id = ?`,
      values
    );
  },

  getRecords: async (table, condition = '1=1', params = []) => {
    const result = await OfflineDB.executeSql(`SELECT * FROM ${table} WHERE ${condition}`, params);
    return result.rows._array;
  },

  deleteRecord: async (table, localId) => {
    await OfflineDB.executeSql(`DELETE FROM ${table} WHERE local_id = ?`, [localId]);
  }

};

export default OfflineDB;
