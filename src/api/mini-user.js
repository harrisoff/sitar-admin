import { databaseAggregate, databaseGet } from "./mini-base";
import { databaseUpdate } from "./mini-extend";
import { timestampFormat } from "../utils";
import { parseArray, formatDouble } from "../utils/wx";

import { COLLECTIONS } from "../../config";

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
          // 0 未设置 1 男 2 女
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

// 获取内容版本号
export function getVersion() {
  const query = `
  db.collection('${COLLECTIONS.SETTING}')
    .where({
      setting_name: "version",
    })
    .get()
  `;
  return databaseGet(query);
}
