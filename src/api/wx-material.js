import request from "./request";
import { formatHTML } from "../utils/html";

// +-
// | 傻逼微信
// | get_materialcount 和 batchget_material 接口返回的 count 值只包括*有效图片*
// | 但是实际上用 getMaterialList 接口获取的时候还会返回 *CropImage*
// | 好像是图文信息废弃的封面图
// | 所以不能根据 count 值计直接算 getMaterialList 的请求次数，只能作参考
// +-

// 获取素材列表
// size 最大 20
// 返回值 content 最长 2w 字符/1Mb
// https://developers.weixin.qq.com/doc/offiaccount/Asset_Management/Get_materials_list.html
export async function getMaterialList(type, page = 1, size = 20) {
  const url = `/wx-api/material/batchget_material`;
  const data = {
    type,
    offset: (page - 1) * size,
    count: size
  };
  return new Promise((resolve, reject) => {
    request({
      url,
      method: "post",
      data
    })
      .then(res => {
        // 添加一个 material_type 字段
        const typedData = res.item.map(item => ({
          ...item,
          material_type: type
        }));
        resolve(typedData);
      })
      .catch(reject);
  });
}
// 图片素材
export function getImageList(page, size) {
  return getMaterialList("image", page, size);
}
// 视频素材
export function getVideoList(page, size) {
  return getMaterialList("video", page, size);
}
// 图文素材
export function getNewsList(page, size) {
  return getMaterialList("news", page, size);
}
// 语音素材
export function getVoiceList(page, size) {
  return getMaterialList("voice", page, size);
}
// 获取素材数量
export async function getMaterialCount() {
  const url = `/wx-api/material/get_materialcount`;
  return new Promise((resolve, reject) => {
    request({
      url,
      method: "get"
    })
      .then(data => {
        // key 与 getMaterialList 的 type 对应
        resolve({
          voice: data.voice_count,
          video: data.video_count,
          image: data.image_count,
          news: data.news_count
        });
      })
      .catch(reject);
  });
}
// 获取单条素材
export function getMaterialById() {}

// 从所有 news 类型的素材中取出同类型的合并为一个数组
export function extractItems(materials) {
  const newsItems = [];
  const imageItems = [];
  const voiceItems = [];
  const videoItems = [];
  materials.forEach(material => {
    const {
      media_id,
      content, // 这个 content 只是 news_item 的父级
      update_time,
      material_type
    } = material;
    const timestamp = update_time * 1000; // s => ms
    material.timestamp = timestamp;
    if (material_type === "news") {
      const contentNewsItem = content.news_item;
      newsItems.push(
        ...contentNewsItem.map((newsItem, index) => {
          const result = {
            ...newsItem,
            media_id, // 原始 media_id
            news_item_index: index, // 在该 news_item 中的索引
            real_id: `${media_id}_${index}`, // 合并后的唯一 id
            update_time,
            timestamp // 当图文素材有多个项目时，update_time 是相同的
          };
          return result;
        })
      );
    } else if (material_type === "image") {
      imageItems.push(material);
    } else if (material_type === "video") {
      videoItems.push(material);
    } else if (material_type === "voice") {
      voiceItems.push(material);
    }
  });
  return {
    news: newsItems,
    image: imageItems,
    voice: voiceItems,
    video: videoItems
  };
}
