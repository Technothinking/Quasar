import { execute } from './sqlite';
import { today, now } from '../utils/time';
import * as Crypto from 'expo-crypto';
import { addToOutbox } from './outbox';

/**
 * Save DPR locally and queue it for sync
 * Supervisor-side, offline-first
 */
export const saveDPR = async ({
  projectId,
  userId,
  stage,
  otherNote,
  workStatus,
  issues,
  issueNote,
}) => {
  console.log('🔵 saveDPR() START');

  const localId = Crypto.randomUUID();
  const date = today();
  const time = now();

  // 1️⃣ Save DPR locally in SQLite
  await execute(
    `INSERT INTO dprs (
      local_id,
      project_id,
      user_id,
      date,
      stage,
      other_note,
      work_status,
      issues,
      issue_note,
      sync_status,
      created_at,
      updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      localId,
      projectId,
      userId,
      date,
      stage,
      otherNote || null,
      workStatus,
      JSON.stringify(issues || []),
      issueNote || null,
      'PENDING',
      time,
      time,
    ]
  );

  console.log('🟢 DPR saved locally');

  // 2️⃣ Queue DPR for backend sync
  await addToOutbox('/dpr', 'POST', {
    id: localId, // client-generated ID (important)
    project_id: projectId,
    user_id: userId,
    date,
    stage,
    other_note: otherNote || null,
    work_status: workStatus,
    issues: issues || [],
    issue_note: issueNote || null,
  });

  console.log('📥 DPR queued for sync');

  return { offline: true };
};
