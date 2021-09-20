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
    return {
      // 商品列表信息
      goodsList: [],
      // 查询字符串和分页信息
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 商品总条数
      total: 0
    }
  },
  methods: {
    // 获取所有商品
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        this.$message.error('获取商品列表失败！')
        return
      }
      this.total = res.data.total
      this.goodsList = res.data.goods
      this.$message.success('获取商品列表成功！')
      console.log(res.data)
    }
  },
  created () {
    this.getGoodsList()
  }
}
</script>

<style lang="less" scoped>
.btn-add {
  margin-left: 15px;
}
</style>
