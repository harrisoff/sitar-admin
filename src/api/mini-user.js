import { databaseAggregate } from "./mini-base";
import { databaseUpdate } from "./mini-extend";
import { timestampFormat } from "../utils";
import { parseArray, formatDouble, formatInt } from "../utils/wx";

import { COLLECTIONS } from "../../config";
import { SOURCE_MAP, SCENE_MAP } from "../constants/wx";

export function getUserList() {
  const query = `
  db.collection('${COLLECTIONS.USER}').aggregate()
      .lookup({
        from: '${COLLECTIONS.ARTICLE}',
        localField: 'open_id',
        foreignField: 'like_id',
        as: 'like_list',
      })
      .lookup({
        from: '${COLLECTIONS.COMMENT}',
        localField: 'open_id',
        foreignField: 'open_id',
        as: 'comment_list',
      })
      .sort({
        first_login: -1
      })
      .end()
  `;
  return new Promise((resolve, reject) => {
    databaseAggregate(query)
      .then(({ data }) => {
        // FIXME: 对于没有授权的用户，有些字段是空的
        const jsonData = parseArray(data);
        const result = jsonData.map(u => {
          const { open_id, like_list, comment_list, gender, first_login } = u;
          const sex =
            gender === undefined ? "" : parseInt(formatDouble(gender));
          const firstLogin = timestampFormat(formatDouble(first_login));
          return {
            ...u,
            openId: open_id,
            likeList: like_list,
            commentList: comment_list,
            likeCount: like_list.length,
            commentCount: comment_list.length,
            firstLogin,
            sex
          };
        });
        resolve(result);
      })
      .catch(reject);
  });
}

// TODO: 聚合怎么同时获取条数？
export function getLogList(page = 1, size = 20) {
  // skip() 和 limit() 顺序有影响
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
        console.log(data);
        const jsonData = parseArray(data);
        const result = jsonData.map(r => {
          console.log(r);
          const {
            open_id,
            level,
            type,
            sub_type,
            data,
            // context,
            // params,
            // type,
            _id
          } = r;
          const timestamp = formatDouble(r.timestamp);
          // 如果清空了 user 表但是没清空 log 表
          // 会有取不到 user 的情况
          const user = r.user[0];
          // context
          // const { CLIENTIP, CLIENTIPV6, SOURCE } = context;
          // params
          // 有时候没有 params?
          // const sceneId = params ? formatDouble(params.scene) : "";
          // const path = params ? params.path : "";
          return {
            openId: open_id,
            level,
            type,
            subType: sub_type,
            nickName: user && user.nickName,
            avatarUrl: user && user.avatarUrl,
            timestamp,
            time: timestampFormat(timestamp),
            data,
            // source: SOURCE_MAP[SOURCE],
            // sceneId: sceneId,
            // scene: SCENE_MAP[sceneId],
            // path,
            // ip: CLIENTIP,
            // ipv6: CLIENTIPV6,
            id: _id
          };
        });
        resolve(result);
      })
      .catch(reject);
  });
}

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

export function setBanned(openId, banned) {
  const query = `
  db.collection('${COLLECTIONS.USER}')
  .where({
    open_id: '${openId}'
  })
  .update({
    data: {
      banned: ${banned}
    }
  })
  `;
  return databaseUpdate(query);
}
