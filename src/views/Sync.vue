<template>
  <div class="view-sync">
    <div class="section">
      <div class="section__title">同步公众号数据</div>
      <div class="sub-section">
        <el-button @click="handleGetToken" size="small" type="primary"
          >获取微信 token</el-button
        >
      </div>
      <div class="sub-section">
        <div class="sub-section__title">查看素材数量</div>
        <el-button @click="getCount" size="small" type="primary"
          >查询</el-button
        >
        <div v-html="countLog"></div>
      </div>
      <div class="sub-section">
        <div class="sub-section__title">所有素材</div>
        <el-button @click="handleSync('all', true)" size="small" type="danger"
          >全量同步</el-button
        >
      </div>
      <div class="sub-section">
        <div class="sub-section__title">图文素材</div>
        <el-button @click="handleSync('news', true)" size="small" type="warning"
          >全量同步</el-button
        >
        <el-button
          @click="handleSync('news', false)"
          size="small"
          type="primary"
          >增量同步</el-button
        ><el-input style="width:unset" size="small" v-model="syncNewsCount">
          <template slot="prepend">前</template>
          <template slot="append">条</template>
        </el-input>
      </div>
      <div class="sub-section">
        <div class="sub-section__title">图片素材</div>
        <el-button
          @click="handleSync('image', true)"
          size="small"
          type="warning"
          >全量同步</el-button
        >
        <el-button
          @click="handleSync('image', false)"
          size="small"
          type="primary"
          >增量同步</el-button
        ><el-input style="width:unset" size="small" v-model="syncImageCount">
          <template slot="prepend">前</template>
          <template slot="append">条</template>
        </el-input>
      </div>
      <div v-html="syncLog"></div>
    </div>
    <div class="section">
      <div class="section__title">更新缓存版本</div>
      修改后需要更新缓存版本，否则小程序端看到的是缓存的旧内容
      <br />
      <el-button @click="handleUpdateVersion" size="small" type="primary"
        >更新缓存版本</el-button
      >
    </div>
  </div>
</template>

<script>
import {
  getImageList,
  getVideoList,
  getVoiceList,
  getNewsList,
  getMaterialCount,
  extractItems
} from "../api/wx-material";
import { getAccessToken } from "../api/auth";
import { databaseUpdate } from "../api/mini-extend";
import {
  resetMaterial,
  getMediaIdsByType,
  databaseAddPartial
} from "../api/mini-material";
import { COLLECTIONS } from "../../config";

const apiMap = {
  video: getVideoList,
  image: getImageList,
  voice: getVoiceList,
  news: getNewsList
};

const collectionNameMap = {
  video: COLLECTIONS.VIDEO_RAW,
  news: COLLECTIONS.NEWS_RAW,
  image: COLLECTIONS.IMAGE_RAW,
  voice: COLLECTIONS.VOICE_RAW
};

// 最大 20，见 getMaterialList 函数注释
const PAGE_SIZE = 20;

export default {
  name: "",
  components: {},
  filters: {},
  mixins: [],
  props: [],
  data() {
    return {
      syncLog: "",
      countLog: "",
      // 增量同步
      syncNewsCount: 10,
      syncImageCount: 20
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {},
  mounted() {},
  beforeUpdate() {},
  methods: {
    handleGetToken() {
      getAccessToken("wx")
        .then(this.$success)
        .catch(this.$message.error);
    },
    // 素材数量
    getCount() {
      this.countLog = "";
      getMaterialCount()
        .then(counts => {
          // 获取条数
          Object.keys(counts).forEach(type => {
            this.countLog += `${type}: ${counts[type]}<br/>`;
          });
        })
        .catch(this.$message.error);
    },
    // 同步入口
    handleSync(type, isFull) {
      this.syncLog = "";
      getMaterialCount()
        .then(async counts => {
          // 考虑到 get_materialcount 接口返回值 count 不准的问题
          // 不能先生成 ajax 数组再请求
          // 需要根据上一次返回值的数量判断是否要继续发送请求
          // 全量同步
          if (isFull) {
            // 获取条数
            this.syncLog += `同步数量参考值：<br/>`;
            if (type === "all") {
              Object.keys(counts).forEach(type => {
                this.syncLog += `${type}: ${counts[type]}<br/>`;
              });
            } else {
              this.syncLog += `${type}: ${counts[type]}<br/>`;
            }
            this.fullSync(type, counts);
          }
          // 增量同步
          // 只能增量同步指定类型的素材
          else {
            this.incSync(type, counts);
          }
        })
        .catch(this.$message.error);
    },
    // 所有类型或单类型素材全量同步
    async fullSync(type, counts) {
      this.syncLog += `开始获取微信素材...<br/>`;
      let materialList = [];
      let errorList = [];
      const types = Object.keys(counts);
      for (const t of types) {
        if (type === "all" || (type !== "all" && t === type)) {
          const api = apiMap[t];
          let hasMore = true;
          let offset = 0;
          while (hasMore) {
            const page = offset / PAGE_SIZE + 1;
            let material = [];
            try {
              material = await api(page, PAGE_SIZE);
            } catch (err) {
              console.error(err);
              errorList.push(err);
            }
            if (material.length < PAGE_SIZE) {
              hasMore = false;
            }
            offset += PAGE_SIZE;
            materialList = materialList.concat(material);
          }
        }
      }
      this.syncLog += `获取完成，开始格式化...<br/>`;
      // 分类
      const extracted = extractItems(materialList);
      // 更新数据库
      this.syncLog += `开始更新数据库...<br/>`;
      try {
        for (const t of types) {
          if (type === "all" || (type !== "all" && t === type)) {
            const collectionName = collectionNameMap[type];
            const mat = extracted[type];
            if (mat.length) await resetMaterial(mat, collectionName);
          }
        }
        this.syncLog += `同步完成<br/>`;
      } catch (err) {
        this.$message.error(err);
      }
    },
    // 单类型素材增量同步
    async incSync(type) {
      try {
        // 1. 获取微信前 n 条
        this.syncLog += `开始获取微信素材...<br/>`;
        let count = 0;
        switch (type) {
          case "image":
            count = this.syncImageCount;
            break;
          case "news":
            count = this.syncNewsCount;
            break;
          default:
            count = 0;
            break;
        }
        const api = apiMap[type];
        const materials = await api(1, count);
        // 2. 分类
        this.syncLog += `获取完成，开始格式化...<br/>`;
        const extracted = extractItems(materials);
        const material = extracted[type];
        // 3. 取数据库前 count 条的 media_id 查重
        this.syncLog += `开始查重...<br/>`;
        const recordMediaIds = await getMediaIdsByType(type, count);
        const filtered = material.filter(
          ({ media_id }) => !recordMediaIds.includes(media_id)
        );
        const inc = filtered.length;
        if (inc === 0) {
          this.syncLog += `无新项目`;
          return;
        }
        // 4. 添加查重之后剩下的，更新 material 类型对应的表
        this.syncLog += `新增${inc}条，开始更新数据库...<br/>`;
        const collectionName = collectionNameMap[type];
        await databaseAddPartial(filtered, collectionName);
        this.syncLog += `同步完成<br/>`;
      } catch (err) {
        this.$error(err);
      }
    },
    // ===== 更新缓存版本 =====
    handleUpdateVersion() {
      // FIXME: 现在需要手动创建记录，这里只调用更新接口
      const version = new Date().getTime();
      const query = `
      db.collection('${COLLECTIONS.SETTING}')
      .where({
        setting_name: 'version'
      })
      .update({
        data: {
          version: "${version}",
        }
      })
      `;
      databaseUpdate(query)
        .then(this.$success)
        .catch(this.$error);
    }
  }
};
</script>

<style lang="less">
.view-sync {
  .section {
    margin: 10px;
    padding: 10px;
    box-shadow: 0 0 2px 1px #ccc;
    color: gray;
    font-size: 14px;
    .section__title {
      font-size: 16px;
      color: black;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .sub-section {
      margin: 10px;
      padding: 10px;
      box-shadow: 0 0 2px 1px #ccc;
    }
  }
}
</style>
