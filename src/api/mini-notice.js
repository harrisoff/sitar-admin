import { databaseGet, databaseAdd } from "./mini-base";
import { databaseUpdate } from "./mini-extend";
import { parseArray } from "../utils/wx";
import { timestampFormat } from "../utils";
import { COLLECTIONS } from "../../config";

export function getNoticeList() {
  const query = `
  db.collection('${COLLECTIONS.NOTICE}')
  .skip(0)
  .limit(999)
  .get()
  `;
  return new Promise((resolve, reject) => {
    databaseGet(query)
      .then(res => {
        const { pager, data } = res;
        const jsonData = parseArray(data);
        jsonData.forEach(e => {
          e.time = timestampFormat(e.timestamp);
        });
        resolve({
          pager,
          data: jsonData
        });
      })
      .catch(reject);
  });
}

export function addNotice(noticeData) {
  const query = `
  db.collection('${COLLECTIONS.NOTICE}')
  .add({
    data: ${JSON.stringify(noticeData)}
  })
  `;
  return databaseAdd(query);
}

export function setNoticeVisibility(id, show) {
  const query = `
    db.collection('${COLLECTIONS.NOTICE}')
    .where({
      _id: '${id}',
    })
    .update({
      data: {
        show: ${show}
      }
    })
  `;
  return databaseUpdate(query);
}
