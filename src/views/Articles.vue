<template>
  <div class="view-article">
    <div>
      <el-table :data="articleList" row-key="id">
        <el-table-column
          type="index"
          label="#"
          align="center"
        ></el-table-column>
        <el-table-column prop="title" label="标题" align="center">
          <template slot-scope="scope">
            <a :href="scope.row.url" target="_blank">{{ scope.row.title }}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="view"
          label="点击"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="like"
          label="点赞"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="thumbUrl"
          label="封面图"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <a
              v-if="scope.row.thumb_url"
              :href="scope.row.thumb_url"
              target="_blank"
              >预览</a
            >
          </template>
        </el-table-column>
        <el-table-column prop="digest" label="摘要" align="center">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.digest"
              placement="top-start"
            >
              <a href="javascript:void(0)">查看</a>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="time"
          label="时间"
          align="center"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="bookTitle"
          label="书名"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="400">
          <template slot-scope="scope">
            <!-- 显示/隐藏 -->
            <el-button
              type="danger"
              size="mini"
              v-if="scope.row.show"
              @click="handleSetVisibility(scope.row.realId, false)"
              >隐藏</el-button
            >
            <el-button
              size="mini"
              v-else
              @click="handleSetVisibility(scope.row.realId, true)"
              >显示</el-button
            >
            <!-- 轮播 -->
            <el-button
              type="danger"
              size="mini"
              v-if="scope.row.carousel"
              @click="setCTL('carousel', scope.row.realId, false)"
              >取消</el-button
            >
            <el-button
              size="mini"
              v-else
              @click="setCTL('carousel', scope.row.realId, true)"
              >轮播</el-button
            >
            <!-- 置顶 -->
            <el-button
              type="danger"
              size="mini"
              v-if="scope.row.top"
              @click="setCTL('top', scope.row.realId, false)"
              >取消</el-button
            >
            <el-button
              size="mini"
              v-else
              @click="setCTL('top', scope.row.realId, true)"
              >置顶</el-button
            >
            <!-- 最近更新 -->
            <el-button
              type="danger"
              size="mini"
              v-if="scope.row.list"
              @click="setCTL('list', scope.row.realId, false)"
              >取消</el-button
            >
            <el-button
              size="mini"
              v-else
              @click="setCTL('list', scope.row.realId, true)"
              >最近更新</el-button
            >
            <el-button size="mini" @click="handleReformat(scope.row)"
              >重新格式化</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="tagId"
          label="标签"
          align="center"
          width="50"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { databaseUpdate } from "../api/mini-extend";
import { getArticleList, setArticleVisibility } from "../api/mini-article";
import { getNewsByRealId, updateArticleHtml } from "../api/mini-material";
import { COLLECTIONS } from "../../config";
import { formatHTML } from "../utils/html";

export default {
  name: "",
  components: {},
  filters: {},
  mixins: [],
  props: [],
  data() {
    return {
      articleList: []
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {
    this.initData();
  },
  mounted() {},
  beforeUpdate() {},
  methods: {
    initData() {
      getArticleList()
        .then(data => {
          this.articleList = data;
        })
        .catch(this.$message.error);
    },
    // 设置 carousel/top/list
    setCTL(type, realId, value) {
      const query = `
      db.collection('${COLLECTIONS.ARTICLE}').where({
        real_id: '${realId}',
      }).update({
        data: {
          ${type}: ${value}
        }
      })
      `;
      databaseUpdate(query)
        .then(msg => {
          this.$success(msg);
          this.initData();
        })
        .catch(this.$message.error);
    },
    // 显示/隐藏
    handleSetVisibility(realId, show) {
      setArticleVisibility(realId, show)
        .then(msg => {
          this.$success(msg);
          this.initData();
        })
        .catch(this.$error);
    },
    // 使用 wx_material 的数据重新生成 html 和 text
    handleReformat({ realId }) {
      getNewsByRealId(realId)
        .then(data => {
          if (data) {
            const { content } = data;
            const { html, text } = formatHTML(content);
            updateArticleHtml(realId, html, text)
              .then(this.$message)
              .catch(this.$error);
          } else {
            this.$warn("没有找到对应素材");
          }
        })
        .catch(this.$error);
    }
  }
};
</script>

<style lang="less">
.view-article {
  .el-table {
    .el-table__row {
      .el-button + .el-button {
        margin-left: 0;
      }
    }
  }
}
</style>
