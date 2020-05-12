import request from "./request";
import { ENV, MINI_UPLOAD_SERVER } from "../../config";
const { CLOUD_ENV } = ENV;

// ======== 云函数 ========
export const callFunction = name => {
  return request({
    url: `https://api.weixin.qq.com/tcb/invokecloudfunction`,
    params: {
      name,
      env: CLOUD_ENV
    },
    method: "post"
  });
};

// ======== 集合 ========
// 集合 - 新增
export const collectionAdd = data => {
  return request({
    url: `/mini-api/databasecollectionadd`,
    method: "post",
    data
  });
};
// 集合 - 删除
export const collectionDelete = data => {
  return request({
    url: `/mini-api/databasecollectiondelete`,
    method: "post",
    data
  });
};
// 集合 - 列表
export const collectionGet = data => {
  return request({
    url: `/mini-api/databasecollectionget`,
    method: "post",
    data
  });
};

// ======== 数据库 ========
// 数据库 - 插入记录
export const databaseAdd = query => {
  const data = {
    env: CLOUD_ENV,
    query
  };
  return request({
    url: `/mini-api/databaseadd`,
    method: "post",
    data
  });
};
// 数据库 - 删除记录
export const databaseDelete = query => {
  const data = {
    env: CLOUD_ENV,
    query
  };
  return request({
    url: `/mini-api/databasedelete`,
    method: "post",
    data
  });
};
// 数据库 - 更新记录
export const databaseUpdateOrigin = query => {
  const data = {
    env: CLOUD_ENV,
    query
  };
  return request({
    url: `/mini-api/databaseupdate`,
    method: "post",
    data
  });
};
// 数据库 - 查询记录
export const databaseGet = query => {
  const data = {
    env: CLOUD_ENV,
    query
  };
  return request({
    url: `/mini-api/databasequery`,
    method: "post",
    data
  });
};
// 聚合
export const databaseAggregate = query => {
  const data = {
    env: CLOUD_ENV,
    query
  };
  return request({
    url: `/mini-api/databaseaggregate`,
    method: "post",
    data
  });
};

// ======== 存储 ========
// 上传单个文件
export const uploadFile = (file, uploadPath, filename) => {
  const data = {
    env: CLOUD_ENV,
    path: uploadPath
  };
  return new Promise((resolve, reject) => {
    // 获取上传链接
    request({
      url: `/mini-api/uploadfile`,
      method: "post",
      data
    })
      .then(data => {
        const { url, authorization, token, cos_file_id, file_id } = data;
        const uploadApi = `/myUpload/${url.split(MINI_UPLOAD_SERVER)[1]}`;
        const formData = new FormData();
        formData.append("key", uploadPath);
        formData.append("Signature", authorization);
        formData.append("x-cos-security-token", token);
        formData.append("x-cos-meta-fileid", cos_file_id);
        formData.append("file", file);
        // 上传
        request({
          url: uploadApi,
          method: "post",
          data: formData
        })
          .then(() => {
            resolve({
              fileId: file_id,
              filename,
              uploadPath
            });
          })
          .catch(reject);
      })
      .catch(reject);
  });
};
// 批量获取文件下载链接
export const getFileURLs = fileIds => {
  let file_list;
  if (typeof fileIds === "string") {
    file_list = [{ fileid: fileIds, max_age: 7200 }];
  } else {
    fileIds.forEach(id => {
      file_list.push({
        fileid: id,
        max_age: 60
      });
    });
  }
  const data = {
    env: CLOUD_ENV,
    file_list: file_list
  };
  return new Promise((resolve, reject) => {
    request({
      url: `/mini-api/batchdownloadfile`,
      method: "post",
      data
    })
      .then(data => {
        resolve(data);
      })
      .catch(reject);
  });
};
// 批量删除文件
export const deleteFiles = fileIds => {
  let file_list = typeof fileIds === "string" ? [fileIds] : fileIds;
  const data = {
    env: CLOUD_ENV,
    fileid_list: file_list
  };
  return request({
    url: `/mini-api/batchdeletefile`,
    method: "post",
    data
  });
};

// ======== 导出 ========
export const exportCollection = data => {
  data.env = CLOUD_ENV;
  console.log(data);
  return request({
    url: `/mini-api/databasemigrateexport`,
    method: "post",
    data
  });
};

export const getExportProgress = job_id => {
  const data = {
    env: CLOUD_ENV,
    job_id
  };
  return request({
    url: `/mini-api/databasemigratequeryinfo`,
    method: "post",
    data
  });
};
