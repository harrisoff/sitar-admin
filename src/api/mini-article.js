import { databaseAggregate } from "./mini-base";
import { databaseUpdate } from "./mini-extend";
import { parseArray, formatDouble } from "../utils/wx";
import { timestampFormat } from "../utils";
import { COLLECTIONS } from "../../config";

// 获取文章列表
// 用于文章页的表格和修改书籍下属文章
export function getArticleList() {
  const query = `
  db.collection('${COLLECTIONS.ARTICLE}').aggregate()
  .project({
    html: false,
    text: false
  })
  .lookup({
    from: '${COLLECTIONS.USER}',
    localField: 'like_id',
    foreignField: 'open_id',
    as: 'users',
  })
  .sort({
    timestamp: -1
  })
  .end()
  `;
  return new Promise((resolve, reject) => {
    databaseAggregate(query)
      .then(({ data }) => {
        const jsonData = parseArray(data);
        const result = jsonData.map(article => {
          const {
            _id,
            real_id,
            update_time,
            thumb_url,
            book_title,
            users,
            tag_id,
            book_id
          } = article;
          const seconds = formatDouble(update_time);
          const view = formatDouble(article.view);
          return {
            ...article,
            id: _id,
            realId: real_id,
            bookId: book_id,
            view,
            time: timestampFormat(seconds * 1000),
            thumbUrl: thumb_url,
            bookTitle: book_title,
            tagId: tag_id,
            like: users.length
          };
        });
        resolve(result);
      })
      .catch(reject);
  });
}

// 根据 real_id 数组批量修改 article 的 book_title
export function updateArticleBook(ids, bookId, bookTitle) {
  const query = `
  db.collection('${COLLECTIONS.ARTICLE}')
  .where({
    real_id: _.in(${JSON.stringify(ids)})
  })
  .update({
    data: {
      book_id: "${bookId}",
      book_title: "${bookTitle}"
    }
  })
  `;
  return databaseUpdate(query);
}
