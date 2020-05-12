<template>
  <div>
    <el-submenu v-if="item.children.length" :index="item.path">
      <template slot="title">
        <i :class="item.meta.icon"></i>
        <span>{{ item.meta.title }}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item
          v-for="(subItem, index) in item.children"
          :key="index"
          :index="subItem.path"
        >
          <i :class="subItem.meta.icon"></i>
          <span slot="title">{{ subItem.meta.title }}</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-menu-item v-else :index="item.path">
      <i :class="item.meta.icon"></i>
      <span slot="title">{{ item.meta.title }}</span>
    </el-menu-item>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  filters: {},
  mixins: [],
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {},
  mounted() {},
  beforeUpdate() {},
  methods: {}
};
</script>

<style lang="less" scoped></style>
