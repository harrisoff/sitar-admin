import { databaseAdd, databaseGet, databaseAggregate } from "./mini-base";
import { databaseUpdate } from "./mini-extend";
import { fileUploadIfNone } from "./mini-file";
import { parseArray } from "../utils/wx";

import { COLLECTIONS, STORAGE } from "../../config";

export function uploadBookCover(file, filename) {
  return fileUploadIfNone(file, STORAGE.BOOK_COVER, filename);
}

// book 分类
export function getBookList() {
  // book 表没有 timestamp 就不排序了
  const query = `
  db.collection('${COLLECTIONS.BOOK}')
  .where({
    type: 'book'
  })
  .skip(0)
  .limit(999)
  .get()
  `;
  return new Promise((resolve, reject) => {
    databaseGet(query)
      .then(res => {
        const { pager, data } = res;
        const jsonData = parseArray(data);
        resolve({
          pager,
          data: jsonData
        });
      })
      .catch(reject);
  });
}

// booklet 分类
export function getBookletList() {
  // 傻逼小程序
  // _.not() 报错
  // book 表没有 timestamp 就不排序了
  const query = `
  db.collection('${COLLECTIONS.BOOK}').aggregate()
  .match({
    type: 'booklet',
  })
  .lookup({
    from: '${COLLECTIONS.ARTICLE}',
    localField: '_id',
    foreignField: 'book_id',
    as: 'articles',
  })
  .end()
  `;
  return new Promise((resolve, reject) => {
    databaseAggregate(query)
      .then(res => {
        const { pager, data } = res;
        const jsonData = parseArray(data);
        resolve({
          pager,
          data: jsonData
        });
      })
      .catch(reject);
  });
}

export function addBook(bookInfo) {
  const query = `
  db.collection('${COLLECTIONS.BOOK}')
  .add({
    data: ${JSON.stringify(bookInfo)}
  })
  `;
  return databaseAdd(query);
}

export function addBooklet(bookletInfo) {
  return addBook(bookletInfo);
}

// 修改书籍信息
export function editBook(id, bookInfo) {
  const query = `
  db.collection('${COLLECTIONS.BOOK}')
  .where({
    _id: '${id}',
  })
  .update({
    data: ${JSON.stringify(bookInfo)}
  })
`;
  return databaseUpdate(query);
}

// 修改书籍下属文章
// 废弃。改为 book 和 article 根据 book_id 联表查询，不需要 book 维护一个 article_id 数组
function updateBookArticle(id, articleIds) {
  const query = `
  db.collection('${COLLECTIONS.BOOK}')
  .where({
    _id: '${id}',
  })
  .update({
    data: {
      article_id: ${JSON.stringify(articleIds)}
    }
  })
  `;
  return databaseUpdate(query);
}
