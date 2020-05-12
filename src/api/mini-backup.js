import { exportCollection, databaseAdd, databaseGet } from "./mini-base";
import { COLLECTIONS } from "../../config";

export function backupCollection(collectionName, fileType = "json") {
  const query = `
  db.collection('${collectionName}')
  .limit(9999)
  .get()
  `;
  var a = {
    file_path: "backup/target.json",
    file_type: fileType === "json" ? 1 : 2, // json/csv
    query
  };
  return exportCollection(a);
}

export function updateBackupRecord(timestamp, jobs) {
  const query = `
  db.collection('${COLLECTIONS.BACKUP}')
  .add({
    data: {
      timestamp: ${timestamp},
      jobs: ${JSON.stringify(jobs)}
    }
  })
  `;
  return databaseAdd(query);
}

export function getLastBackupTime() {
  const query = `
  db.collection('${COLLECTIONS.BACKUP}')
  .orderBy('timestamp', 'desc')
  .get()
  `;
  return new Promise((resolve, reject) => {
    databaseGet(query)
      .then(({ data }) => {
        data = JSON.parse(data);
        if (data.length > 0) {
          const latest = data[0];
          resolve(parseInt(latest.timestamp));
        } else {
          reject();
        }
      })
      .catch(reject);
  });
}
