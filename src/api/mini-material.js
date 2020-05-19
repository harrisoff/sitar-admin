import { databaseAdd, databaseGet } from "./mini-base";
import { databaseUpdate, databaseClear } from "./mini-extend";
import { parseArray } from "../utils/wx";
import { escapeHtml } from "../utils/weapp";
import { COLLECTIONS } from "../../config";

// 所有 news 及其是否添加为 article，如果添加了是否显示
export function getNewsList() {
  const query = `
  db.collection('${COLLECTIONS.NEWS_RAW}')
  .orderBy('timestamp', 'desc')
  .limit(999)
  .get()
  `;
  return new Promise((resolve, reject) => {
    databaseGet(query)
      .then(({ data }) => {
        const jsonData = parseArray(data);
        resolve(jsonData);
      })
      .catch(reject);
  });
}

export function getNewsByRealId(realId) {
  const query = `
  db.collection('${COLLECTIONS.NEWS_RAW}')
  .field({
    content: true
  })
  .where({
    real_id: '${realId}'
  })
  .get()
  `;
  return new Promise((resolve, reject) => {
    databaseGet(query)
      .then(({ data }) => {
        const jsonData = parseArray(data);
        resolve(jsonData[0]);
      })
      .catch(reject);
  });
}

// 仅用于
// 由于之前解析 html 时有问题，需要重新解析的情景
export function updateArticleHtml(realId, html, text) {
  const data = {
    html,
    text,
    last_modified: new Date().getTime()
  };
  let query = `
  db.collection('${COLLECTIONS.ARTICLE}')
  .where({
    real_id: '${realId}',
  })
  .update({
    data: ${JSON.stringify(data)}
  })
  `;
  query = escapeHtml(query);
  return databaseUpdate(query);
}

// 获取文章的显示状态
// 用在图文素材管理页，更新素材的的添加/显示状态
export function getArticleStatus() {
  const query = `
  db.collection('${COLLECTIONS.ARTICLE}')
  .field({
    show: true,
    real_id: true,
  })
  .limit(999)
  .get()
  `;
  return new Promise((resolve, reject) => {
    databaseGet(query)
      .then(({ data }) => {
        const jsonData = parseArray(data);
        resolve(jsonData);
      })
      .catch(reject);
  });
}

// 显示一篇 news
export function addArticle(data) {
  let query = `
    db.collection('${COLLECTIONS.ARTICLE}')
    .add({
      data: ${JSON.stringify(data)}
    })`;
  query = escapeHtml(query);
  return databaseAdd(query);
}

// 清空旧数据并添加
export async function resetMaterial(data, collectionName) {
  return new Promise((resolve, reject) => {
    databaseClear(collectionName)
      .then(async () => {
        try {
          const result = await databaseAddPartial(data, collectionName);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      })
      .catch(reject);
  });
}

// 傻逼云开发
// body 超长时报错 content size out of limit hints
// 但是文档没有说明长度限制，只能摸索着写一个了
// 然后从总数据里一点点截取
export async function databaseAddPartial(data, collectionName) {
  const partialList = [];
  let partialData = [];
  while (data.length) {
    partialData = partialData.concat(data.shift());
    if (getSize(partialData) >= 50000 || data.length === 0) {
      partialList.push(partialData);
      partialData = [];
    }
  }
  const taskList = partialList.map(partialData => {
    let query = `
    db.collection('${collectionName}')
    .add({
      data: ${JSON.stringify(partialData)}
    })
    `;
    query = escapeHtml(query);
    return () => databaseAdd(query);
  });
  const results = [];
  let result = null;
  for (const task of taskList) {
    try {
      result = await task();
      results.push(result);
    } catch (err) {
      console.error(err);
      result = err;
    }
    results.push(result);
  }
  return results;
}

function getSize(data) {
  return JSON.stringify(data).length;
}

// 获取指定类型素材前 limit 条，用于 media_id 判断去重
export function getMediaIdsByType(type, limit) {
  let collectionName = "";
  switch (type) {
    case "image":
      collectionName = COLLECTIONS.IMAGE_RAW;
      break;
    case "news":
      collectionName = COLLECTIONS.NEWS_RAW;
      break;
    case "voice":
      collectionName = COLLECTIONS.VOICE_RAW;
      break;
    case "video":
      collectionName = COLLECTIONS.VIDEO_RAW;
      break;
    default:
      break;
  }
  const query = `
  db.collection('${collectionName}')
  .field({
    media_id: true
  })
  .orderBy('update_time', 'desc')
  .limit(${limit})
  .get()
  `;
  return new Promise((resolve, reject) => {
    databaseGet(query)
      .then(({ data }) => {
        const jsonData = parseArray(data);
        resolve(jsonData.map(e => e.media_id));
      })
      .catch(reject);
  });
}
