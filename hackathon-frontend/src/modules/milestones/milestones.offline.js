import OfflineDB from "../../context/OfflineDB";
import { v4 as uuidv4 } from "uuid";

export const createMilestoneOffline = async ({
  project_local_id,
  name,
}) => {
  const data = {
    local_id: uuidv4(),
    server_id: null,
    project_local_id,
    project_server_id: null,
    name,
    sync_status: "pending",
    last_synced_at: null,
  };

  await OfflineDB.insertRecord("project_milestones", data);
  return data.local_id;
};

export const getMilestonesByProject = async (project_local_id) => {
  return await OfflineDB.getAll(
    "project_milestones",
    "project_local_id = ?",
    [project_local_id]
  );
};
