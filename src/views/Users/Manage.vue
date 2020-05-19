<template>
  <div class="view-users-manage">
    <el-table :data="userList" row-key="openId" v-loading="isLoading">
      <el-table-column prop="nickName" label="昵称"></el-table-column>
      <el-table-column prop="avatarUrl" label="头像">
        <template slot-scope="scope">
          <img class="avatar" :src="scope.row.avatarUrl" />
        </template>
      </el-table-column>
      <el-table-column prop="sex" label="性别">
        <template slot-scope="scope">
          <i v-if="scope.row.sex === 1" class="el-icon-male"></i>
          <i v-else-if="scope.row.sex === 1" class="el-icon-female"></i>
        </template>
      </el-table-column>
      <el-table-column prop="language" label="语言"></el-table-column>
      <el-table-column prop="country" label="国家"></el-table-column>
      <el-table-column prop="province" label="省份"></el-table-column>
      <el-table-column prop="city" label="城市"></el-table-column>
      <el-table-column prop="openId" label="OPENID"></el-table-column>
      <el-table-column prop="commentCount" label="评论数"></el-table-column>
      <el-table-column prop="likeCount" label="点赞数"></el-table-column>
      <el-table-column prop="banned" label="状态">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="danger"
            v-if="scope.row.banned"
            @click="handleSetBanned(scope.row.openId, false)"
            >解封</el-button
          >
          <el-button
            size="small"
            v-else
            @click="handleSetBanned(scope.row.openId, true)"
            >封禁</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getUserList, setBanned } from "../../api/mini-user";

export default {
  name: "",
  components: {},
  filters: {},
  mixins: [],
  props: [],
  data() {
    return {
      userList: [],
      isLoading: false
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {
    this.getUserList();
  },
  mounted() {},
  beforeUpdate() {},
  methods: {
    handleSetBanned(openId, banned) {
      setBanned(openId, banned)
        .then(this.getUserList)
        .catch(this.$error);
    },
    getUserList() {
      this.isLoading = true;
      getUserList()
        .then(res => {
          this.userList = res;
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
.view-users-manage {
  .avatar {
    width: 50px;
  }
  .el-icon-male {
    color: blue;
    font-size: 24px;
  }
  .el-icon-female {
    color: red;
    font-size: 24px;
  }
}
</style>
