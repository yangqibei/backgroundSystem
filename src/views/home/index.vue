<template>
  <el-container class="container">
    <!-- 头部 -->
    <el-header>
      <div class="left">
        <img src="@/assets/logo.png" alt="" />
        <span>小城画画后台管理系统</span>
      </div>
      <button class="head-btn">退出</button>
    </el-header>
    <!-- 左侧栏 -->
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggleMenu" @click="isCollapse = !isCollapse">|||</div>
        <el-menu
          background-color="#373d41"
          text-color="#fff"
          unique-opened
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          collapse-transition="true"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span slot="title">用户管理</span>
            </template>
            <el-menu-item index="1-1">选项1</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">权限管理</span>
            </template>
            <el-menu-item index="2-1">选项1</el-menu-item>
            <el-menu-item index="2-2">选项2</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span slot="title">商品管理</span>
            </template>
            <el-menu-item index="3-1">选项1</el-menu-item>
            <el-menu-item index="3-2">选项2</el-menu-item>
            <el-menu-item index="3-3">选项2</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span slot="title">订单管理</span>
            </template>
            <el-menu-item index="4-1">选项1</el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span slot="title">数据统计</span>
            </template>
            <el-menu-item index="5-1">选项1</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-main>欢迎登录</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created () { },
  data () {
    return {
      isCollapse: false
    }
  },
  methods: {},
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.container {
  height: 100vh;
  .el-header {
    display: flex;
    justify-content: space-between;
    line-height: 60px;
    background-color: lightblue;
    img {
      width: 61px;
      height: 60px;
    }
    span {
      color: #fff;
      font-size: 22px;
      font-weight: normal;
      margin-left: 10px;
    }
    .head-btn {
      display: inline-block;
      height: 50px;
      white-space: nowrap;
      cursor: pointer;
      background: #fff;
      border: 1px solid #dcdfe6;
      color: #606266;
      text-align: center;
      box-sizing: border-box;
      margin-top: 5px;
      padding: 12px 20px;
      font-size: 14px;
      border-radius: 4px;
    }
  }
  .el-aside {
    .toggleMenu {
      width: 100%;
      height: 40px;
      background-color: #f47070;
      text-align: center;
      line-height: 40px;
      cursor: pointer;
      color: #fff;
    }
    background-color: #373d41;
  }
  .el-main {
    background-color: #eaedf1;
  }
  .el-menu {
    border-right: none;
  }
}
</style>
