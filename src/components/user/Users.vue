<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/users'}">用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <!-- 列表上方的功能区 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" size="medium">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="medium">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 用户列表查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      userList: [],
      total: 0
    }
  },
  methods: {
    // 获取用户列表数据
    async getUserList () {
      // 这个{ params : ... } ?params?相当于命名参数
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        this.$message.error('用户列表数据获取失败！')
        return
      }
      this.userList = res.data.users
      this.total = res.data.total
      console.log(this.userList)
      console.log(this.total)
    }
  },
  created () {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
</style>
