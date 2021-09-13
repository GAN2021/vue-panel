<template>
  <el-container class="home-container">
    <!-- 导航栏区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" width="30px" height="30px" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 中间区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#2b3758"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-user"></i>
              <span>用户列表</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-location"></i>
              <span>选项一</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区 -->
      <el-main>主题区</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menuList: []
    }
  },
  methods: {
    // 获取左侧菜单数据
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')

      if (res.meta.status !== 200) {
        this.$message.error('菜单数据获取失败')
      }

      this.menuList = res.data
      this.$message.success('菜单数据获取成功')
      console.log(this.menuList)
    },
    // 退出登录
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  },
  created () {
    this.getMenuList()
  }
}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #202941;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #eee;
  font-size: 20px;
  padding-left: 5px;

  > div {
    display: flex;
    justify-content: space-between;

    span {
      padding-left: 15px;
    }
  }
}
.el-aside {
  background-color: #2b3758;
}
.el-main {
  background-color: #eee;
}
.home-container {
  height: 100%;
}
.el-menu {
  border-right: 0px;
}
</style>
