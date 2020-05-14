import { databaseAggregate } from "./mini-base";
import { databaseUpdate } from "./mini-extend";
import { timestampFormat } from "../utils";
import { parseArray, formatDouble } from "../utils/wx";

import { COLLECTIONS } from "../../config";

export function getCommentList() {
  const query = `
  db.collection('${COLLECTIONS.COMMENT}').aggregate()
      .lookup({
        from: '${COLLECTIONS.USER}',
        localField: 'open_id',
        foreignField: 'open_id',
        as: 'user',
      })
      .lookup({
        from: '${COLLECTIONS.ARTICLE}',
        localField: 'article_id',
        foreignField: 'real_id',
        as: 'article',
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
        const result = jsonData.map(r => {
          const { open_id, _id, content, reply_id, show, article_id } = r;
          const timestamp = formatDouble(r.timestamp);
          const user = r.user[0];
          const article = r.article[0];
          return {
            id: _id,
            show,
            content,
            replyId: reply_id,
            timestamp,
            time: timestampFormat(timestamp),
            // user
            openId: open_id,
            nickName: user.nickName,
            avatarUrl: user.avatarUrl,
            // article
            articleId: article_id,
            title: article.title
          };
        });
        resolve(result);
      })
      .catch(reject);
  });
}

export function setCommentVisibility(id, show) {
  const query = `
  db.collection('${COLLECTIONS.COMMENT}')
  .where({
    _id: '${id}'
  })
  .update({
    data: {
      show: ${show}
    }
  })
  `;
  return databaseUpdate(query);
}
