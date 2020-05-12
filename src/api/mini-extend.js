import { databaseDelete, databaseUpdateOrigin, databaseGet } from "./mini-base";

// 数据库更新，判断了返回值的 matched，modified 等字段
export const databaseUpdate = query => {
  return new Promise((resolve, reject) => {
    databaseUpdateOrigin(query)
      .then(res => {
        const { errcode, errmsg, matched, modified } = res;
        // 请求成功，但未必修改成功
        if (errcode === 0) {
          // 修改失败，没有匹配的记录
          if (matched === 0) {
            reject("没有匹配的记录");
          } else {
            if (modified === 0) {
              resolve("没有发生变化");
            } else {
              resolve("修改成功");
            }
          }
        } else {
          // 修改失败
          reject(errmsg);
        }
      })
      .catch(reject);
  });
};

export function databaseSearch(collectionName, options = {}) {
  // 服务端 API 不支持自定义字段和排序
  const { where = {}, pagination = {} } = options;
  let query = `
  db.collection('${collectionName}')
  `;
  if (Object.keys(where).length !== 0) {
    query += `
    .where(${JSON.stringify(where)})
    `;
  }
  if (Object.keys(pagination).length !== 0) {
    const { page = 1, size = 999 } = pagination;
    query += `
    .limit(${size}).skip(${(page - 1) * size})
    `;
  }
  query += ".limit(999).get()";
  return databaseGet(query);
}

export function databaseClear(collectionName) {
  const query = `
    db.collection('${collectionName}')
      .where(${JSON.stringify({ asdfgh: null })})
      .remove()
    `;
  return databaseDelete(query);
}
