<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { getAccessToken } from "./api/auth";
export default {
  name: "App",
  components: {},
  directives: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {
    // getAccessToken()
    //   .then()
    //   .catch(err => {
    //     this.$message.error("自动获取 token 失败: " + err);
    //   });
    setInterval(() => {
      getAccessToken()
        .then()
        .catch(err => {
          this.$message.error("自动获取 token 失败: " + err);
        });
    }, 10 * 60 * 1000);
  },
  mounted() {},
  beforeDestroy() {},
  methods: {}
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
#app {
  height: 100vh;
}
</style>
