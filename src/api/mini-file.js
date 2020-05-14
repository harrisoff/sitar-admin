import { databaseAdd, uploadFile, getFileURLs } from "./mini-base";
import { genFileIdByPath } from "../utils/wx";
import { databaseUpdate } from "./mini-extend";
import { COLLECTIONS } from "../../config";

// 文件不存在时上传
export const fileUploadIfNone = (file, uploadPath, filename) => {
  const fileId = genFileIdByPath(uploadPath);
  return new Promise((resolve, reject) => {
    // 可以替换为查 file 表
    // 不过尝试获取 url 才是 common solution
    getFileURLs(fileId)
      .then(res => {
        const fileInfo = res.file_list[0];
        // 已存在
        if (fileInfo.status === 0 && fileInfo.download_url) {
          reject("存在同名文件");
        } else {
          uploadFile(file, uploadPath, filename)
            .then(resolve)
            .catch(reject);
        }
      })
      .catch(reject);
  });
};

// 文件存在时覆盖并上传 - 默认就是
export const fileUploadForce = (file, uploadPath) => {
  return uploadFile(file, uploadPath);
};

// 上传文件后添加一条记录
export function addFileRecord(file_id, filename, file_path) {
  const collectionName = COLLECTIONS.FILE;
  const queryData = {
    add_time: new Date().getTime(),
    file_id,
    filename,
    file_path,
    ref: 0
  };
  const query = `
  db.collection('${collectionName}')
  .add({
    data: ${JSON.stringify(queryData)}
  })
  `;
  return databaseAdd(query);
}

// 文件被使用后更新 ref 字段
export function updateFileRecord(file_id) {
  const collectionName = COLLECTIONS.FILE;
  const query = `
  db.collection('${collectionName}')
  .where({
    file_id: '${file_id}',
  })
  .update({
    data: {
      ref: 1
    }
  })
  `;
  return databaseUpdate(query);
}
