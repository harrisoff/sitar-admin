import { ENV } from "../../config";
const { N4, N10, CLOUD_ENV } = ENV;

// 照目前的状况来看，完全可以使用文件 id 拼接出下载链接，不需要调用 batchdownloadfile 接口
export const genFileURL = fileId => {
  const splitter = `cloud://${CLOUD_ENV}.${N4}-${CLOUD_ENV}-${N10}/`;
  const filePath = fileId.split(splitter)[1];
  return `https://${N4}-${CLOUD_ENV}-${N10}.tcb.qcloud.la/${filePath}`;
};

// 根据文件路径拼接文件 id
export const genFileIdByPath = filePath => {
  return `cloud://${CLOUD_ENV}.${N4}-${CLOUD_ENV}-${N10}/${filePath}`;
};

// 根据文件 id 获取文件名
export const getFileNameById = id => {
  const prefix = `cloud://${CLOUD_ENV}.${N4}-${CLOUD_ENV}-${N10}/`;
  const fullPath = id.split(prefix)[1];
  return fullPath.split("/").pop();
};

export const formatDouble = obj => {
  // number 类型的字段返回值实际上是
  // const timestamp = {
  //   $numberDouble: xxx
  // };
  return parseFloat(obj[Object.keys(obj)[0]]);
};

export const formatInt = obj => {
  // const timestamp = {
  //   $numberInt: xxx
  // };
  return parseInt(obj[Object.keys(obj)[0]]);
};

// JSON.parse 数组
export const parseArray = arr => {
  // 傻逼小程序
  return arr.map(element => {
    return JSON.parse(element);
  });
};
