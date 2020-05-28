import { databaseAggregate } from "./mini-base";
import { databaseUpdate } from "./mini-extend";
import { timestampFormat } from "../utils";
import { parseArray, formatDouble, formatInt } from "../utils/wx";

import { COLLECTIONS } from "../../config";
import { SOURCE_MAP, SCENE_MAP } from "../constants/wx";

export function getOverViewLog(page, size) {
  const query = `
  db.collection('${COLLECTIONS.LOG}').aggregate()
  .lookup({
    from: '${COLLECTIONS.USER}',
    localField: 'open_id',
    foreignField: 'open_id',
    as: 'user',
  })
  .sort({
    timestamp: -1
  })
  .skip(${(page - 1) * size})
  .limit(${size})
  .end()
  `;
  return new Promise((resolve, reject) => {
    databaseAggregate(query)
      .then(({ data }) => {
        const jsonData = parseArray(data);
        const result = jsonData.map(r => {
          const { open_id, level, type, sub_type, _id, context } = r;
          let data = r.data;
          const timestamp = formatDouble(r.timestamp);
          // 如果清空了 user 表但是没清空 log 表
          // 会有取不到 user 的情况
          const user = r.user[0];
          if (sub_type === "login") {
            const { params, systemInfo } = data;
            const sceneId = formatInt(params.scene);
            const scene = SCENE_MAP[sceneId];
            let {
              SDKVersion,
              batteryLevel,
              brand,
              locationEnabled,
              model,
              notificationAlertAuthorized,
              notificationAuthorized,
              notificationBadgeAuthorized,
              notificationSoundAuthorized,
              platform,
              system,
              version,
              wifiEnabled
            } = systemInfo;
            batteryLevel = formatInt(systemInfo.batteryLevel);
            data = {
              scene,
              sdk: SDKVersion,
              battery: batteryLevel,
              brand,
              location: locationEnabled,
              model,
              notificationAlertAuthorized,
              notificationAuthorized,
              notificationBadgeAuthorized,
              notificationSoundAuthorized,
              os: platform,
              osVersion: system,
              wxVersion: version,
              wifi: wifiEnabled
            };
          }
          // level === error || sub_type === login
          if (context) {
            context.source = SOURCE_MAP[context.SOURCE];
          }
          return {
            context,
            openId: open_id,
            level,
            type,
            subType: sub_type,
            nickName: user && user.nickName,
            avatarUrl: user && user.avatarUrl,
            timestamp,
            time: timestampFormat(timestamp),
            data,
            id: _id
          };
        });
        resolve(result);
      })
      .catch(reject);
  });
}

export function getLoginLog() {}

export function getArticleLog() {}

export function getRandomLog() {}

export function getKeywordLog() {}

export function getErrorLog() {}

export function getLogCount() {
  const query = `
  db.collection('${COLLECTIONS.LOG}').aggregate()
  .lookup({
    from: '${COLLECTIONS.USER}',
    localField: 'open_id',
    foreignField: 'open_id',
    as: 'user',
  })
  .count('total')
  .end()
  `;
  return new Promise((resolve, reject) => {
    databaseAggregate(query)
      .then(({ data }) => {
        if (data.length) {
          const jsonData = parseArray(data);
          let total = jsonData[0].total;
          total = formatInt(total);
          resolve(total);
        } else {
          resolve(0);
        }
      })
      .catch(reject);
  });
}
