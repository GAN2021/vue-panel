<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/orders'}">订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input size="medium" v-model="queryInfo.query" placeholder="请输入订单编号">
            <el-button slot="append" class="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#" align="center"></el-table-column>
        <el-table-column label="订单编号" prop="order_number" align="center"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" align="center"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" align="center">
          <template v-slot="scopeData">
            <el-tag type="success" v-if="scopeData.row.pay_status==='1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" align="center">
          <template v-slot="scopeData">
            <span v-if="scopeData.row.is_send==='1'">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time" align="center">
          <template v-slot="scopeData">{{scopeData.row.create_time|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120px" align="center">
          <template v-slot="scopeData">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="scopeData.row"></el-button>
            <el-button type="success" size="mini" icon="el-icon-location"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页条 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
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
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: []
    }
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        this.$message.error('订单列表获取失败！')
        return
      }
      this.orderList = res.data.goods
      this.total = res.data.total
      this.$message.success('订单列表获取成功！')
      console.log(res.data.goods)
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    }
  },
  created () {
    this.getOrderList()
  }
}
</script>

<style lang="less" scoped>
.el-table {
  top: 10px;
}
</style>
