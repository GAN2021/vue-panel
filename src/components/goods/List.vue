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
          <el-input placeholder="请输入商品关键词" v-model="queryInfo.query" size="medium" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="medium" class="btn-add">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 商品列表区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格（元）" prop="goods_price" width="70px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="商品数量" prop="goods_number" width="70px"></el-table-column>
        <el-table-column label="创建时间" width="140px">
          <!-- 全局的时间格式化过滤器 -->
          <template v-slot="scopeData">{{scopeData.row.add_time|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" :tmp="scope.row.goods_id"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页条 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 20, 40]"
        :page-size="queryInfo.pagesize"
        :current-page="queryInfo.pagenum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
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
    },
    // 分页条分大小变化
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 分页条页码变化
    handleCurrentChange (newCurrent) {
      this.queryInfo.pagenum = newCurrent
      this.getGoodsList()
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
