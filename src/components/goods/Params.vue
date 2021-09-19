<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/params'}">分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-alert title="注意：只能为三级分类设置参数！" type="warning" :closable="false" show-icon></el-alert>

      <!-- 分类选择 -->
      <el-row class="cat-opt">
        <el-col>
          选择商品分类：
          <el-cascader
            expand-trigger="hover"
            :options="cateList"
            :props="cateProps"
            v-model="seletedKeys"
            clearable
            @change="handleCateChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- 分类参数（tabs）区 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="small" :disabled="isBtnDisabled">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数ID" prop="attr_id"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot>
                <el-button size="mini" type="primary" class="el-icon-edit">&nbsp;编辑</el-button>
                <el-button size="mini" type="danger" class="el-icon-delete">&nbsp;删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="small" :disabled="isBtnDisabled">添加属性</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数ID" prop="attr_id"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot>
                <el-button size="mini" type="primary" class="el-icon-edit">&nbsp;编辑</el-button>
                <el-button size="mini" type="danger" class="el-icon-delete">&nbsp;删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 所有分类列表
      cateList: [],
      // 分类级联选择器配置项
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 分类级联选择器选中项
      seletedKeys: [],
      // 当前激活的页签
      activeName: 'many',
      // 动态参数列表数据
      manyTableData: [],
      // 静态属性列表数据
      onlyTableData: []
    }
  },
  methods: {
    // 获取所有分类
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        this.$message.error('分类列表获取失败！')
        return
      }
      this.cateList = res.data
      console.log(res.data)
    },
    // 级联选择器选中变化处理函数
    handleCateChange () {
      // 没有选择三级分类
      if (this.seletedKeys.length !== 3) {
        this.seletedKeys = []
      }

      // 根据选择分类id、当前参数面板类型，发起参数列表请求
      this.getParamsData()
    },
    // tabs点击处理函数
    handleTabClick () {
      this.getParamsData()
    },
    // 获取参数列表
    // 根据选择分类id、当前参数面板类型
    async getParamsData () {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) {
        this.$message.error('参数列表获取失败！')
        return
      }
      // 绑定到不同的数据源
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    }
  },
  computed: {
    // 未选择分类则，按钮被禁用
    isBtnDisabled () {
      return this.seletedKeys.length !== 3
    },
    // 当前选中的三级分类ID
    cateId () {
      if (this.seletedKeys.length === 3) {
        return this.seletedKeys[2]
      } else {
        return null
      }
    }
  },
  created () {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.cat-opt {
  margin-top: 15px;
}
.el-cascader {
  width: 50%;
}
</style>
