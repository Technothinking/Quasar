import OfflineDB from "../../context/OfflineDB";
import { v4 as uuidv4 } from "uuid";

export const upsertProjectSiteOffline = async ({
  project_local_id,
  latitude,
  longitude,
  radius_meters,
}) => {
  const existing = await OfflineDB.getOne(
    "project_sites",
    "project_local_id = ?",
    [project_local_id]
  );

  if (existing) {
    // Update
    await OfflineDB.updateWhere(
      "project_sites",
      {
        latitude,
        longitude,
        radius_meters,
        sync_status: "pending",
      },
      "project_local_id = ?",
      [project_local_id]
    );
    return existing.local_id;
  }

  // Insert
  const data = {
    local_id: uuidv4(),
    server_id: null,
    project_local_id,
    project_server_id: null,
    latitude,
    longitude,
    radius_meters,
    sync_status: "pending",
    last_synced_at: null,
  };

  await OfflineDB.insertRecord("project_sites", data);
  return data.local_id;
};

export const getProjectSiteByProject = async (project_local_id) => {
  return await OfflineDB.getOne(
    "project_sites",
    "project_local_id = ?",
    [project_local_id]
  );
};
