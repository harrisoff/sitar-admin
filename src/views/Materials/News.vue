<template>
  <div class="view-material-news">
    <div>
      <el-table :data="newsList" row-key="_id" v-loading="isLoading">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="title" label="标题">
          <template slot-scope="scope">
            <a :href="scope.row.url" target="_blank">{{ scope.row.title }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span v-if="scope.row.added">已添加</span>
            <el-button v-else size="small" @click="handleAddArticle(scope.row)"
              >添加</el-button
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
  addArticle
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
      newsList: [],
      isLoading: false
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
      this.isLoading = true;
      try {
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
          const added = match
            ? true // 已添加
            : false; // 未添加
          return {
            ...newsItem,
            time: timestampFormat(new Date(update_time * 1000)),
            added
          };
        });
      } catch (err) {
        this.$error(err);
      } finally {
        this.isLoading = false;
      }
    },
    // events
    handleAddArticle(row) {
      // 删除用来显示列表的多余数据项
      delete row.added;
      delete row.time;
      delete row._id;
      // 初次添加
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
        view: 0,
        last_modified: new Date().getTime()
      };
      addArticle(articleData)
        .then(() => {
          this.$success("更新成功");
          this.initTable();
        })
        .catch(this.$message.error);
    }
  }
};
</script>

<style lang="less"></style>
