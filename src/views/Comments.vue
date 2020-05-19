<template>
  <div class="view-comment">
    <el-table :data="commentList" row-key="id" v-loading="isLoading">
      <el-table-column prop="nickName" label="昵称"></el-table-column>
      <el-table-column prop="avatarUrl" label="头像">
        <template slot-scope="scope">
          <img class="avatar" :src="scope.row.avatarUrl" />
        </template>
      </el-table-column>
      <el-table-column prop="time" label="时间"></el-table-column>
      <el-table-column prop="content" label="内容"></el-table-column>
      <el-table-column prop="title" label="文章标题"></el-table-column>
      <el-table-column prop="replyId" label="回复 ID"></el-table-column>
      <el-table-column prop="show" label="操作">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="default"
            v-if="scope.row.show"
            @click="handleSetVisibility(scope.row.id, false)"
            >隐藏</el-button
          >
          <el-button
            size="small"
            type="danger"
            v-else
            @click="handleSetVisibility(scope.row.id, true)"
            >显示</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getCommentList, setCommentVisibility } from "../api/mini-comment";

export default {
  name: "",
  components: {},
  filters: {},
  mixins: [],
  props: [],
  data() {
    return {
      commentList: [],
      isLoading: false
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {
    this.getCommentList();
  },
  mounted() {},
  beforeUpdate() {},
  methods: {
    handleSetVisibility(id, show) {
      setCommentVisibility(id, show)
        .then(this.getCommentList)
        .catch(this.$error);
    },
    getCommentList() {
      this.isLoading = true;
      getCommentList()
        .then(res => {
          this.commentList = res;
        })
        .catch(this.$error)
        .then(_ => {
          this.isLoading = false;
        });
    }
  }
};
</script>

<style lang="less">
.view-comment {
  .avatar {
    width: 50px;
  }
}
</style>
