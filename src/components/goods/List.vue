<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/goods'}">商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入商品关键词" size="medium">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="medium" class="btn-add">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 商品列表区域 -->
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {},
  created () { }
}
</script>

<style lang="less" scoped>
.btn-add {
  margin-left: 15px;
}
</style>
