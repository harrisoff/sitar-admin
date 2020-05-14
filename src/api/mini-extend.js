import { databaseDelete, databaseUpdateOrigin } from "./mini-base";

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

// 删除表里所有数据
export function databaseClear(collectionName) {
  const query = `
    db.collection('${collectionName}')
      .where(${JSON.stringify({ asdfgh: null })})
      .remove()
    `;
  return databaseDelete(query);
}
