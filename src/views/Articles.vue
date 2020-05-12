<template>
  <div class="view-article">
    <div>
      <el-table :data="articleList" row-key="id">
        <el-table-column type="index" label="#" align="center">
        </el-table-column>
        <el-table-column prop="title" label="标题" align="center">
          <template slot-scope="scope">
            <a :href="scope.row.url" target="_blank">{{ scope.row.title }}</a>
          </template>
        </el-table-column>
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
        <el-table-column
          prop="digest"
          label="摘要"
          align="center"
        ></el-table-column>
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
        <el-table-column
          prop="carousel"
          label="轮播"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="mini"
              v-if="scope.row.carousel"
              @click="setCTL('carousel', scope.row.real_id, false)"
              >取消</el-button
            >
            <el-button
              size="mini"
              v-else
              @click="setCTL('carousel', scope.row.real_id, true)"
              >设置</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="top" label="置顶" align="center" width="100">
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="mini"
              v-if="scope.row.top"
              @click="setCTL('top', scope.row.real_id, false)"
              >取消</el-button
            >
            <el-button
              size="mini"
              v-else
              @click="setCTL('top', scope.row.real_id, true)"
              >设置</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="list"
          label="最近更新"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="mini"
              v-if="scope.row.list"
              @click="setCTL('list', scope.row.real_id, false)"
              >取消</el-button
            >
            <el-button
              size="mini"
              v-else
              @click="setCTL('list', scope.row.real_id, true)"
              >设置</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="tagId"
          label="标签"
          align="center"
          width="50"
        ></el-table-column>
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
      </el-table>
    </div>
  </div>
</template>

<script>
import { databaseUpdate } from "../api/mini-extend";
import { getArticleList } from "../api/mini-article";
import { COLLECTIONS } from "../../config";

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
    setCTL(type, id, value) {
      const query = `
      db.collection('${COLLECTIONS.ARTICLE}').where({
        real_id: '${id}',
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
    }
  }
};
</script>

<style lang="less"></style>
