<template>
  <div class="view-notice">
    <el-button size="mini" type="primary" @click="handleShowDialog"
      >添加通知</el-button
    >
    <!-- 历史通知 -->
    <el-table
      :data="noticeList"
      row-key="id"
      stripe
      border
      v-loading="isLoading"
    >
      <el-table-column type="index" label="#" align="center"></el-table-column>
      <el-table-column prop="title" label="标题"> </el-table-column>
      <el-table-column prop="content" label="内容"> </el-table-column>
      <el-table-column prop="level" label="类型">
        <template slot-scope="scope">
          <span v-if="scope.row.level === 'info'" class="notice__info"
            >普通</span
          >
          <span v-else class="notice__warn">警告</span>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="时间"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="danger"
            v-if="scope.row.show"
            @click="handleSetVisibility(scope.row._id, false)"
            >隐藏</el-button
          >
          <el-button
            size="small"
            v-else
            @click="handleSetVisibility(scope.row._id, true)"
            >显示</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增通知 -->
    <el-dialog
      title="新增通知"
      :visible="isDialogVisible"
      :before-close="() => (isDialogVisible = false)"
      class="add-notice"
    >
      <el-form>
        <el-form-item label="类型">
          <el-radio v-model="level" label="info">普通</el-radio>
          <el-radio v-model="level" label="warn">警告</el-radio>
        </el-form-item>
        <el-form-item label="标题" inline-message="asd">
          <el-input v-model="title" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="content" />
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="handleBeforeSubmit"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  addNotice,
  getNoticeList,
  setNoticeVisibility
} from "../api/mini-notice";

export default {
  name: "",
  components: {},
  filters: {},
  mixins: [],
  props: [],
  data() {
    return {
      noticeList: [],
      isLoading: false,
      // form
      isDialogVisible: false,
      level: "",
      title: "",
      content: ""
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {
    this.initTableData();
  },
  mounted() {},
  beforeUpdate() {},
  methods: {
    initTableData() {
      this.isLoading = true;
      getNoticeList()
        .then(({ data }) => {
          console.log(data);
          this.noticeList = data;
        })
        .catch(this.$error)
        .then(_ => {
          this.isLoading = false;
        });
    },
    handleBeforeSubmit() {
      if (!(this.level && this.title && this.content)) return;
      this.$confirm("确定？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        const noticeData = {
          level: this.level,
          content: this.content,
          title: this.title,
          timestamp: new Date().getTime(),
          show: true
        };
        addNotice(noticeData)
          .then(_ => {
            this.$success("添加成功");
            this.isDialogVisible = false;
            this.initTableData();
          })
          .catch(this.$error);
      });
    },
    handleSetVisibility(id, show) {
      setNoticeVisibility(id, show)
        .then(_ => {
          this.$success("修改成功");
          this.initTableData();
        })
        .catch(this.$error);
    },
    handleShowDialog() {
      this.title = "";
      this.content = "";
      this.level = "";
      this.isDialogVisible = true;
    }
  }
};
</script>

<style lang="less" scoped>
.notice__info {
  color: blue;
}
.notice__warn {
  color: red;
}
</style>
