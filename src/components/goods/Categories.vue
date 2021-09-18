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
