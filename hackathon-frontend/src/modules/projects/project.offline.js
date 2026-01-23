import OfflineDB from "../../context/OfflineDB";
import { v4 as uuidv4 } from "uuid";

export const createProjectOffline = async (project) => {
  const data = {
    local_id: uuidv4(),
    server_id: null,
    name: project.name,
    description: project.description,
    start_date: project.start_date,
    end_date: project.end_date,
    created_by: project.created_by,
    sync_status: "pending",
    last_synced_at: null,
  };

  await OfflineDB.insertRecord("projects", data);
  return data.local_id;
};

export const getAllProjectsOffline = async () => {
  return await OfflineDB.getRecords("projects");
};

export const updateProjectOffline = async (localId, updates) => {
  await OfflineDB.updateRecord(
    "projects",
    { ...updates, sync_status: "pending" },
    localId
  );
};
