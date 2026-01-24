import { execute, query } from './sqlite';
import { uuid } from '../utils/uuid';
import { now, today } from '../utils/time';

export const addDPR = async (data) => {
  return execute(`
    INSERT INTO dpr (
      local_id,
      site_id,
      work_description,
      progress_percent,
      issues,
      report_date,
      created_at,
      updated_at,
      sync_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `, [
    uuid(),
    data.siteId,
    data.work_description,
    data.progress_percent,
    data.issues,
    today(),
    now(),
    now()
  ]);
};

export const getDPRs = async (siteId) => {
  return query(`
    SELECT * FROM dpr
    WHERE site_id = ?
    ORDER BY report_date DESC
  `, [siteId]);
};
