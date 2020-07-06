<template>
  <div class="view-login">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">西塔尔之声后台管理系统</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <i class="el-icon-user-solid" />
        </span>
        <el-input
          v-model="loginForm.username"
          placeholder="APPID"
          name="username"
          type="text"
          tabindex="1"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <i class="el-icon-lock" />
        </span>
        <el-input
          v-model="loginForm.password"
          type="password"
          placeholder="SECRET"
          name="password"
          @keyup.enter.native="handleLogin"
          show-password
        />
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          style="width:100%"
          @click="handleLogin"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getMiniToken } from "../api/auth";
import { getVersion } from "../api/mini-user";

export default {
  name: "",
  components: {},
  filters: {},
  mixins: [],
  props: [],
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [{ required: true, trigger: "blur", message: "缺少 APPID" }],
        password: [{ required: true, trigger: "blur", message: "缺少 SECRET" }]
      },
      loading: false
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {},
  mounted() {},
  beforeUpdate() {},
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          getMiniToken(this.loginForm.username, this.loginForm.password)
            .then(() => {
              getVersion()
                .then(res => {
                  const data = JSON.parse(res.data[0]);
                  if (data.setting_name === "version") {
                    this.$router.push({ path: "/" });
                  } else {
                    throw new Error("");
                  }
                })
                .catch(err => {
                  this.$warn("APPID 错误");
                })
                .then(() => {
                  this.loading = false;
                });
            })
            .catch(this.$error)
            .then(() => {
              this.loading = false;
            });
        } else {
          this.$warn("表单校验失败");
        }
      });
    }
  }
};
</script>

<!-- vue-element-admin -->
<style lang="less">
@bg: #283443;
@light_gray: #fff;
@cursor: #fff;

/* reset element-ui css */
.view-login {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: @light_gray;
      height: 47px;
      caret-color: @cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px @bg inset !important;
        -webkit-text-fill-color: @cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="less" scoped>
@bg: #2d3a4b;
@dark_gray: #889aa4;
@light_gray: #eee;

.view-login {
  min-height: 100%;
  width: 100%;
  background-color: @bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: @dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: @light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: @dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
