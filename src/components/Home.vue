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
      <el-aside :width="isCollapsed ? '64px' : '200px'">
        <!-- 侧边栏收起按钮 -->
        <div class="toggle-button" @click="toggleMenu">|||</div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#2b3758"
          text-color="#fff"
          active-text-color="#ffd04b"
          default-active="1"
          :collapse="isCollapsed"
          :collapse-transition="false"
          router
          unique-opened
        >
          <!-- 一级菜单 -->
          <!-- 以及菜单的'/'+item.path似乎没什么路由作用 -->
          <el-submenu :index="'/'+item.path" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单区域 -->
            <template v-slot:title>
              <i :class="iconObjs[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <i class="el-icon-menu"></i>
              <span>{{subItem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menuList: [],
      // 一级菜单图标（硬编码[todo:]）
      iconObjs: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 侧边栏收起
      isCollapsed: false
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
    // 侧边栏收起与展开
    toggleMenu () {
      this.isCollapsed = !this.isCollapsed
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
.toggle-button {
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.iconfont {
  padding-right: 7px;
}
</style>
