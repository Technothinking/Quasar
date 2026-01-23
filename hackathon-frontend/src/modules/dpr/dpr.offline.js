import OfflineDB from "../../context/OfflineDB";
import { v4 as uuidv4 } from "uuid";

export const createDPROffline = async (payload) => {
  const existing = await OfflineDB.getOne(
    "daily_dprs",
    "project_local_id = ? AND date = ?",
    [payload.project_local_id, payload.date]
  );

  if (existing) {
    throw new Error("DPR already exists for today");
  }

  const dpr = {
    local_id: uuidv4(),
    server_id: null,

    project_local_id: payload.project_local_id,
    project_server_id: null,

    milestone_local_id: payload.milestone_local_id,
    milestone_server_id: null,

    date: payload.date,

    active_stage: payload.active_stage,
    work_status: payload.work_status,

    issues: JSON.stringify(payload.issues || []),
    issue_note: payload.issue_note || null,

    submitted_by: payload.submitted_by,

    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),

    sync_status: "pending",
    last_synced_at: null,
  };

  await OfflineDB.insertRecord("daily_dprs", dpr);
  return dpr.local_id;
};

export const updateDPROffline = async (local_id, updates) => {
  updates.updated_at = new Date().toISOString();
  updates.sync_status = "pending";

  await OfflineDB.updateRecord(
    "daily_dprs",
    updates,
    "local_id = ?",
    [local_id]
  );
};

export const getDPRsByProject = async (project_local_id) => {
  const rows = await OfflineDB.getAll(
    "daily_dprs",
    "project_local_id = ?",
    [project_local_id]
  );

  return rows.map(r => ({
    ...r,
    issues: JSON.parse(r.issues || "[]"),
  }));
};
