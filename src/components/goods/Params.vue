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
          <el-button
            type="primary"
            size="small"
            @click="showParamDialog"
            :disabled="isBtnDisabled"
          >添加参数</el-button>
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
          <el-button
            type="primary"
            size="small"
            @click="showParamDialog"
            :disabled="isBtnDisabled"
          >添加属性</el-button>
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

    <!-- 参数添加对话框（动态参数、静态属性） -->
    <!-- 对话框 -->
    <el-dialog
      :title="addParamTitle"
      :visible.sync="addParamDialogVisible"
      @close="addParamDialogClose"
      width="50%"
    >
      <!-- 表单 -->
      <el-form
        :model="addParamForm"
        ref="addParamFormRef"
        :rules="addParamFormRules"
        label-width="80px"
      >
        <el-form-item :label="labelText" prop="attr_name">
          <el-input v-model="addParamForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addParam">提 交</el-button>
        <el-button @click="addParamDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
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
      onlyTableData: [],
      // 添加参数表单可见性
      addParamDialogVisible: false,
      // 添加参数表单数据
      addParamForm: {
        attr_name: ''
      },
      // 添加参数表单验证规则
      addParamFormRules: {
        attr_name: [
          { required: true, message: '字段不能为空', trigger: 'blur' }
        ]
      }
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
    },
    // 显示[添加参数]对话框
    showParamDialog () {
      this.addParamDialogVisible = true
    },
    // [添加参数]对话框关闭处理函数
    addParamDialogClose () {
      this.$refs.addParamFormRef.resetFields()
    },
    // 提交添加参数请求
    addParam () {
      // 预校验
      this.$refs.addParamFormRef.validate(async valid => {
        if (!valid) {
          return
        }

        const params = {
          attr_name: this.addParamForm.attr_name,
          attr_sel: this.activeName
        }
        // 发请求
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, params)
        if (res.meta.status !== 201) {
          this.$message.error('添加失败！')
          return
        }
        // 成功
        this.addParamDialogVisible = false
        this.$message.success('添加成功！')
        this.getParamsData()
      })
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
    },
    // 添加参数表单的标题
    addParamTitle () {
      if (this.activeName === 'many') {
        return '添加参数'
      } else if (this.activeName === 'only') {
        return '添加属性'
      } else {
        console.log('数据出错')
        return null
      }
    },
    // 添加参数表单的字段标签
    labelText () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else if (this.activeName === 'only') {
        return '静态属性'
      } else {
        console.log('数据出错')
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
