import api from '../services/api';
import { query, execute } from '../db/sqlite';
import { now } from '../utils/time';

const TABLES = ['attendance', 'dpr'];

export const runSync = async () => {
  for (const table of TABLES) {
    const rows = await query(`
      SELECT * FROM ${table}
      WHERE sync_status = 'pending'
    `);

    for (const row of rows) {
      try {
        await api.post(`/sync/${table}`, row);

        await execute(`
          UPDATE ${table}
          SET sync_status = 'synced',
              last_synced_at = ?
          WHERE local_id = ?
        `, [now(), row.local_id]);

      } catch (err) {
        console.log(`Sync failed for ${table}`, row.local_id);
      }
    }
  }
};
