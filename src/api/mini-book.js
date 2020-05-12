import { databaseAdd } from "./mini-base";
import { databaseUpdate, databaseSearch } from "./mini-extend";
import { fileUploadIfNone } from "./mini-file";
import { parseArray } from "../utils/wx";

import { COLLECTIONS, STORAGE } from "../../config";

export function uploadBookCover(file, filename) {
  const uploadPath = STORAGE.BOOK_COVER + "/" + filename;
  return fileUploadIfNone(file, uploadPath, filename);
}

export function getBookList() {
  return new Promise((resolve, reject) => {
    databaseSearch(COLLECTIONS.BOOK, { pagination: { size: 999 } })
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
  db.collection('${COLLECTIONS.BOOK}').add({
    data: ${JSON.stringify(bookInfo)}
  })
  `;
  return databaseAdd(query);
}

// 修改书籍信息
export function editBook(id, bookInfo) {
  const query = `
  db.collection('${COLLECTIONS.BOOK}').where({
    _id: '${id}',
  }).update({
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
