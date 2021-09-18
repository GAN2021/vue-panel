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
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        show-index
        index-text="#"
        :show-row-hover="false"
        :expand-type="false"
        border
        class="catTable"
      >
        <!-- 是否启用列 -->
        <template v-slot:isok="scope">
          <i class="el-icon-success" style="color:green" v-if="scope.row.cat_deleted===false"></i>
          <i class="el-icon-error" style="color:red" v-else-if="scope.row.cat_delete===true"></i>
        </template>
        <!-- 分类级别列 -->
        <template v-slot:level="scope">
          <el-tag type="primary" size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else-if="scope.row.cat_level===2">三级</el-tag>
        </template>
        <!-- 操作列 -->
        <template v-slot:opts="scope">
          <el-button type="primary" size="mini" class="el-icon-edit" @click="scope">&nbsp;编辑</el-button>
          <el-button type="danger" size="mini" class="el-icon-delete">&nbsp;删除</el-button>
        </template>
      </tree-table>

      <!-- 分页条 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
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
      total: '',
      // 用于vue-table组件列绑定
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否启用',
        type: 'template',
        template: 'isok'
      }, {
        label: '分类级别',
        type: 'template',
        template: 'level'
      }, {
        label: '操作',
        type: 'template',
        template: 'opts'
      }]
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
    },
    // 分页条页码大小变化
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 分页条页数变化
    handleCurrentChange (current) {
      this.queryInfo.pagenum = current
      this.getCateList()
    }
  },
  created () {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.catTable {
  margin-top: 20px;
}
</style>
