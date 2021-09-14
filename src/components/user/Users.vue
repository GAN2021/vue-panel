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
      <el-row gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" size="medium">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="medium">添加用户</el-button>
        </el-col>
      </el-row>

    <!-- 用户列区域 -->
    </el-card>

  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
</style>
