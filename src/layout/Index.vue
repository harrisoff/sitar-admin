<template>
  <div style="height:100%">
    <el-container style="height:100%">
      <el-header style="border-bottom:solid 1px #e6e6e6">
        <router-link style="float:left;padding:10px;cursor:pointer" to="/">
          <img src="../assets/logo.png" style="height:40px;" />
        </router-link>
        <span :class="{ env: true, 'is-prod': isProd }">{{ envName }}</span>
      </el-header>
      <el-container>
        <el-aside
          width="200px"
          style="background-color: rgb(238, 241, 246);text-align:left;"
        >
          <el-menu :default-active="defaultActive" :router="true">
            <sidebar-item
              v-for="menuItem in menuItems"
              :key="menuItem.index"
              :item="menuItem"
            ></sidebar-item>
          </el-menu>
        </el-aside>
        <el-main
          style="height: calc(100vh - 60px); overflow: auto;"
          id="el-main"
        >
          <router-view />
        </el-main>
      </el-container>
    </el-container>
    <el-backtop target="#el-main"></el-backtop>
  </div>
</template>

<script>
import { routes } from "@/router";

import { ENV } from "../../config";
import SidebarItem from "./SidebarItem";

export default {
  name: "",
  components: { SidebarItem },
  filters: {},
  mixins: [],
  props: [],
  data() {
    return {
      defaultActive: "/",
      env: ENV.CLOUD_ENV
    };
  },
  computed: {
    menuItems() {
      const i = [];
      routes[0].children.forEach((route, index) => {
        const { menu } = route.meta || {};
        if (menu) {
          i.push({
            index,
            meta: route.meta,
            path: route.path,
            children: route.children
              ? route.children.filter(r => r.meta.menu)
              : []
          });
        }
      });
      return i;
    },
    isProd() {
      return this.env !== "sitar-dev";
    },
    envName() {
      return this.env === "sitar-dev" ? "开发环境" : "正式环境";
    }
  },
  watch: {},
  beforeCreate() {},
  created() {
    this.defaultActive = this.$route.path;
  },
  mounted() {},
  beforeUpdate() {},
  methods: {}
};
</script>

<style lang="less" scoped>
.env {
  display: inline-block;
  line-height: 60px;
  font-weight: bold;
  &.is-prod {
    color: red;
  }
}
</style>
