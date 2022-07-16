<template>
  <el-container class="container">
    <!-- 头部 -->
    <el-header>
      <div class="left">
        <img src="@/assets/logo.png" alt="" />
        <span>小趴菜后台管理系统</span>
      </div>
      <el-button type="text" @click="open" class="head-btn">退出</el-button>
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
          collapse-transition
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span slot="title">用户管理</span>
            </template>
            <el-menu-item index="1-1" @click="$router.push('/home/userList')"
              >用户列表</el-menu-item
            >
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">权限管理</span>
            </template>
            <el-menu-item index="2-1" @click="$router.push('/home/nameList')"
              >角色列表</el-menu-item
            >
            <el-menu-item
              index="2-2"
              @click="$router.push('/home/permissionList')"
              >权限列表</el-menu-item
            >
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span slot="title">商品管理</span>
            </template>
            <el-menu-item index="3-1" @click="$router.push('/home/goodsList')"
              >商品列表</el-menu-item
            >
            <el-menu-item
              index="3-2"
              @click="$router.push('/home/sortingParameter')"
              >分类参数</el-menu-item
            >
            <el-menu-item
              index="3-3"
              @click="$router.push('/home/goodsCategory')"
              >商品分类</el-menu-item
            >
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span slot="title">订单管理</span>
            </template>
            <el-menu-item index="4-1" @click="$router.push('/home/orderList')"
              >订单列表</el-menu-item
            >
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span slot="title">数据统计</span>
            </template>
            <el-menu-item index="5-1" @click="$router.push('/dataReport')"
              >数据报表</el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
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
  methods: {
    open () {
      this.$confirm('确定退出当前账号么？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$store.commit('setToken', '')
        this.$router.push('/login')
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  },
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
.el-main {
  background-color: #eaedf1;
  padding: 20px;
}
</style>
