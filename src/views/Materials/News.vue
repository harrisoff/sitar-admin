<template>
  <div class="view-news">
    <div>
      <el-table :data="newsList" row-key="_id">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="title" label="标题">
          <template slot-scope="scope">
            <a :href="scope.row.url" target="_blank">{{ scope.row.title }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="时间"></el-table-column>
        <el-table-column prop="statusText" label="状态"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="handleSet(scope.row, 'add')"
              v-if="scope.row.statusCode === -1"
              :data-status="scope.row.statusCode"
              >添加</el-button
            >
            <el-button
              size="small"
              type="success"
              @click="handleSet(scope.row, 'show')"
              v-if="scope.row.statusCode === 0"
              :data-status="scope.row.statusCode"
              >显示</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleRevert(scope.row)"
              v-if="scope.row.statusCode === 1"
              >隐藏</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {
  getNewsList,
  getArticleStatus,
  setArticle
} from "../../api/mini-material";
import { timestampFormat } from "../../utils";
import { formatHTML } from "../../utils/html";

export default {
  name: "",
  components: {},
  filters: {},
  mixins: [],
  props: [],
  data() {
    return {
      newsListRaw: [],
      articleListRaw: [],
      newsList: []
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {
    this.initTable();
  },
  mounted() {},
  beforeUpdate() {},
  methods: {
    async initTable() {
      // 先获取所有 news，再使用 article 的 show 更新
      // news 只需要获取一次
      // 不使用联表查询
      // 因为聚合时没法选择字段，会把 article 所有字段全部返回
      // 包括大量无用的文章内容数据
      if (this.newsListRaw.length === 0) {
        this.newsListRaw = await getNewsList();
      }
      const articleList = await getArticleStatus();
      this.newsList = this.newsListRaw.map(newsItem => {
        const { real_id, update_time } = newsItem;
        const match = articleList.find(
          articleItem => articleItem.real_id === real_id
        );
        let statusText = "未添加";
        let statusCode = -1;
        let elType = "warning";
        if (match) {
          if (match.show) {
            statusText = "已显示";
            statusCode = 1;
            elType = "danger";
          } else {
            statusText = "已隐藏";
            statusCode = 0;
            elType = "success";
          }
        }
        return {
          ...newsItem,
          time: timestampFormat(new Date(update_time * 1000)),
          statusText,
          statusCode,
          elType
        };
      });
    },
    // events
    handleSet(row, type) {
      // 删除用来显示列表的多余数据项
      delete row.statusText;
      delete row.statusCode;
      delete row.elType;
      delete row.time;
      delete row._id;
      // 初次添加
      if (type === "add") {
        // content 解析为 html 和 text
        // 丢弃原 content 字段
        const { html, text } = formatHTML(row.content);
        delete row.content;
        const articleData = {
          ...row,
          html,
          text,
          book_id: "",
          book_title: "",
          carousel: false,
          like_id: [],
          list: false,
          top: false,
          tag_id: [],
          show: true,
          view: 0
        };
        setArticle("add", articleData)
          .then(() => {
            this.$message("修改成功");
            this.initTable();
          })
          .catch(this.$message.error);
      }
      // 状态更新
      else {
        // 根据 id 更新一下 show 值
        setArticle("show", row.real_id)
          .then(msg => {
            this.$message(msg);
            this.initTable();
          })
          .catch(this.$message.error);
      }
    },
    handleRevert(row) {
      setArticle("hide", row.real_id)
        .then(msg => {
          this.$message(msg);
          this.initTable();
        })
        .catch(this.$message.error);
    }
  }
};
</script>

<style lang="less">
.add {
  color: orange;
}
show {
  color: green;
}
.hide {
  color: red;
}
</style>
