import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import { getDB } from './sqlite';

const API_BASE = 'http://172.16.6.247:8000'; // change later

export const startSyncEngine = () => {
  NetInfo.addEventListener(state => {
    if (state.isConnected) {
      flushOutbox();
    }
  });
};

const flushOutbox = async () => {
  const db = await getDB();

  const rows = await db.getAllAsync(
    `SELECT * FROM outbox WHERE status = 'PENDING' ORDER BY created_at ASC`
  );

  for (const item of rows) {
    try {
      await axios({
        method: item.method,
        url: API_BASE + item.endpoint,
        data: JSON.parse(item.payload),
      });

      await db.runAsync(
        `UPDATE outbox SET status = 'SENT' WHERE id = ?`,
        [item.id]
      );

      console.log('✅ SYNCED:', item.id);
    } catch (err) {
      console.log('❌ SYNC FAILED:', item.id, err.message);
      return; // stop on first failure
    }
  }
};
