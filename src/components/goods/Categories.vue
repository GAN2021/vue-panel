<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/categories'}">分类列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-button type="primary" size="medium">添加商品分类</el-button>
      </el-row>

      <!-- 树形表格区域（商品分类列表） -->
      <!-- 默认值 :tree-props="{children: 'children'}" -->
      <el-table :data="cateList" row-key="cat_id" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="cat_id" label="ID" sortable></el-table-column>
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column prop="cat_delete" label="是否有效" sortable>
          <template v-slot="scopeData">
            <i class="el-icon-success" style="color:green" v-if="scopeData.row.cat_deleted===false"></i>
            <i class="el-icon-error" style="color:red" v-else-if="scopeData.row.cat_delete===true"></i>
          </template>
        </el-table-column>
        <el-table-column prop="cat_level" label="分类层级">
          <template v-slot="scopeData">
            <el-tag type="primary" size="mini" v-if="scopeData.row.cat_level===0">一级</el-tag>
            <el-tag type="success" size="mini" v-else-if="scopeData.row.cat_level===1">二级</el-tag>
            <el-tag type="warning" size="mini" v-else-if="scopeData.row.cat_level===2">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" size="mini" class="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="mini" class="el-icon-delete">删除</el-button>
        </el-table-column>
      </el-table>

      <!-- 分页条 -->
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品分类列表
      cateList: [],
      // 商品分类列表查询参数
      queryInfo: {
        type: 3,
        pagenum: 1, // 注意cateAPI返回的是0
        pagesize: 5
      },
      // 总页数
      total: ''
    }
  },
  methods: {
    // 获取所有商品分类
    async getCateList () {
      // 注意此API，请求pagenum=1 返回的内容是第一页，但是pagenum返回0
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        this.$message.error('获取商品分类列表失败！')
        return
      }
      // 保存到本地data中
      this.cateList = res.data.result
      this.total = res.data.total
      this.queryInfo.pagenum = res.data.pagenum + 1
      this.queryInfo.pagesize = res.data.pagesize
      console.log(this.cateList)
      console.log(this.total)
      console.log(this.queryInfo.pagenum)
      console.log(this.queryInfo.pagesize)
    }
  },
  created () {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
</style>
