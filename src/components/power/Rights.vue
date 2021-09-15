<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/rights'}">权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-table :data="rightList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限层级">
          <template v-slot="scopeData">
            <el-tag v-if="scopeData.row.level==='0'" size="small">一级</el-tag>
            <el-tag v-if="scopeData.row.level==='1'" size="small" type="success">二级</el-tag>
            <el-tag v-if="scopeData.row.level==='2'" size="small" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightList: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    // 获取权限列表
    async getRightsList () {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        this.$message.error('权限列表获取失败')
        return
      }
      this.$message.success('权限列表获取成功')
      this.rightList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
</style>
