<template>
  <div class="view-users-log">
    <el-table :data="logList" v-loading="isLoading">
      <el-table-column type="expand">
        <template slot-scope="scope">
          {{ JSON.stringify(scope.row.data) }}
        </template>
      </el-table-column>
      <el-table-column prop="nickName" label="昵称"></el-table-column>
      <el-table-column prop="avatarUrl" label="头像">
        <template slot-scope="scope">
          <img class="avatar" :src="scope.row.avatarUrl" />
        </template>
      </el-table-column>
      <el-table-column prop="level" label="等级">
        <template slot-scope="scope">
          <span v-if="scope.row.level === 'error'" style="color:red"
            >ERROR</span
          >
          <span v-else>LOG</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型"></el-table-column>
      <el-table-column prop="subType" label="子类型"></el-table-column>
      <el-table-column prop="time" label="时间"></el-table-column>
      <!-- <el-table-column prop="source" label="来源"></el-table-column>
      <el-table-column prop="scene" label="场景"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column prop="ip" label="IP"></el-table-column>
      <el-table-column prop="ipv6" label="IPv6"></el-table-column> -->
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getLogList, getLogCount } from "../../api/mini-user";

export default {
  name: "",
  components: {},
  filters: {},
  mixins: [],
  props: [],
  data() {
    return {
      logList: [],
      pageSize: 20,
      currentPage: 1,
      total: 0,
      isLoading: false
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {
    getLogCount()
      .then(total => {
        this.total = total;
      })
      .catch(this.$error);
    this.getLogList();
  },
  mounted() {},
  beforeUpdate() {},
  methods: {
    getLogList() {
      this.isLoading = true;
      getLogList(this.currentPage, this.pageSize)
        .then(res => {
          this.logList = res;
        })
        .catch(this.$error)
        .then(_ => {
          this.isLoading = false;
        });
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.getLogList();
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getLogList();
    }
  }
};
</script>

<style lang="less" scoped>
.view-users-log {
  .avatar {
    width: 50px;
  }
}
</style>
