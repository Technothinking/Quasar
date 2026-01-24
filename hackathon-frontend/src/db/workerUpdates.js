import { execute, query } from './sqlite';
import { today, now } from '../utils/time';
import * as Crypto from 'expo-crypto';
import { addToOutbox } from './outbox';

export const saveWorkerUpdate = async ({
  workerId,
  projectId,
  workDone,
  locationText,
  photoUri = null,
}) => {
  console.log('🟦 saveWorkerUpdate() START');

  const localId = Crypto.randomUUID();
  const date = today();
  const time = now();

  // 1️⃣ Save locally
  await execute(
    `INSERT INTO worker_updates (
      local_id,
      project_id,
      worker_id,
      date,
      work_done,
      location_text,
      photo_uri,
      sync_status,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      localId,
      projectId,
      workerId,
      date,
      workDone,
      locationText,
      photoUri,
      'PENDING',
      time,
    ]
  );

  console.log('🟢 Worker update saved locally');

  // 🔍 DEBUG: read immediately after insert
  const rows = await query(
    'SELECT * FROM worker_updates ORDER BY created_at DESC'
  );
  console.log('🧪 WORKER UPDATES (after insert):', rows);

  // 2️⃣ Queue for sync
  await addToOutbox('/worker/update', 'POST', {
    id: localId,
    project_id: projectId,
    worker_id: workerId,
    date,
    work_done: workDone,
    location_text: locationText,
  });

  console.log('📥 Worker update queued');

  return { offline: true };
};
