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
      seletedKeys: []
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
      if (this.seletedKeys.length !== 3) {
        this.seletedKeys = []
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
