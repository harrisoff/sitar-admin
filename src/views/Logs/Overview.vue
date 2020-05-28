<template>
  <div class="view-logs-overview">
    <el-table :data="logList" v-loading="isLoading">
      <el-table-column type="expand">
        <template slot-scope="{ row }">
          {{ JSON.stringify(row.data) }}
        </template>
      </el-table-column>
      <el-table-column prop="nickName" label="昵称"></el-table-column>
      <el-table-column prop="avatarUrl" label="头像">
        <template slot-scope="scope">
          <img class="avatar" :src="scope.row.avatarUrl" />
        </template>
      </el-table-column>
      <el-table-column prop="time" label="时间"></el-table-column>
      <el-table-column prop="level" label="等级">
        <template slot-scope="scope">
          <span v-if="scope.row.level === 'error'" style="color:red"
            >ERROR</span
          >
          <span v-else>LOG</span>
        </template>
      </el-table-column>
      <el-table-column label="动作">
        <template slot-scope="{ row }">
          <span v-if="row.data.cache">
            打开文章:
            {{ typeMap[row.type][row.subType][row.data.cache] }}
          </span>
          <!-- 随机图片 -->
          <span v-else-if="row.data.type">
            {{ typeMap[row.type][row.subType][row.data.type] }}
          </span>
          <!-- 其他 -->
          <span v-else>
            {{ typeMap[row.type][row.subType] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="数据">
        <template slot-scope="{ row }">
          <span v-if="row.subType === 'article'"> </span>
          <span
            v-else-if="row.subType === 'random' && row.data.type === 'song'"
          ></span>
          <span v-else-if="row.subType === 'search'"></span>
          <span></span>
          <span></span>
        </template>
      </el-table-column>
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
import { getOverViewLog, getLogCount } from "../../api/mini-log";

const typeMap = {
  user: {
    login: "冷启动",
    article: {
      add: "新增缓存",
      update: "更新缓存",
      old: "使用缓存"
    },
    cache: "删除缓存",
    random: {
      song: "随机歌曲",
      article: "随机文章",
      image: "随机图片"
    },
    search: "搜索"
  },
  miniApi: {
    getUserInfo: "获取用户信息",
    authSetting: "获取授权信息",
    backgroundAudioManager: "播放背景音乐",
    // 两种报错
    setStorageSync: "setStorageSync",
    getStorageSync: "getStorageSync"
  },
  auto: {
    cache: "自动清理缓存"
  }
};

export default {
  name: "",
  components: {},
  filters: {},
  mixins: [],
  props: [],
  data() {
    return {
      typeMap,
      logList: [],
      pageSize: 50,
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
      getOverViewLog(this.currentPage, this.pageSize)
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
.view-logs-overview {
  .avatar {
    width: 50px;
  }
}
</style>
