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
        <el-button type="primary" size="medium" @click="showAddCateDialog">添加商品分类</el-button>
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
          <el-button
            type="primary"
            size="mini"
            class="el-icon-edit"
            @click="showEditDialog(scope.row.cat_id)"
          >&nbsp;编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            class="el-icon-delete"
            @click="removeCat(scope.row.cat_id)"
          >&nbsp;删除</el-button>
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

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      @close="addCateDialogClose"
      width="50%"
    >
      <!-- 添加分类表单 -->
      <el-form
        :model="addCateForm"
        ref="addCateFormRef"
        :rules="addCateFormRules"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- props指定配置数据 -->
          <!-- options指定数据源 -->
          <!-- v-model指定的时表单控件的值 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="parentCateList"
            :props="cascaderProp"
            @change="parentCateChanged"
            clearable
            :change-on-select="true"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addCate">提 交</el-button>
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      @close="editCateDialogClose"
      width="50%"
    >
      <!-- 编辑分类表单 -->
      <el-form
        :model="editCateForm"
        ref="editCateFormRef"
        :rules="editCateFormRules"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <!-- 这里可能组件嵌套过深，导致无法修改input内容 -->
          <el-input v-model="editCateForm.cat_name" @input="fuckElementUIChange($event)"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateCate">提 交</el-button>
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
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
      total: 0,
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
      }],
      // 添加分类对话框可见性
      addCateDialogVisible: false,
      // 添加分类表单
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        // 添加的分类层级
        cat_level: 0
      },
      // 添加分类表单验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '分类名不能为空', trigger: 'blur' }
        ]
      },
      // 所有父级分类（非叶子级）
      parentCateList: [],
      // 级联选择器选中项
      selectedCateKeys: [],
      // 级联选择器配置
      cascaderProp: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 分类编辑表单
      editCateForm: {
        id: '',
        cat_name: ''
      },
      // 分类编辑对话框可见性
      editCateDialogVisible: false,
      // 分类编辑表单规则
      editCateFormRules: {
        cat_name: [
          { required: true, message: '分类名不能为空', trigger: 'blur' }
        ]
      }
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
    },
    // 显示添加分类对话框
    showAddCateDialog () {
      this.addCateDialogVisible = true
      this.getParentCateList()
    },
    // 获取所有父级（所以非叶子级）分类列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        this.$message.error('获取所有父级分类失败！')
        return
      }
      this.parentCateList = res.data
      console.log(res.data)
    },
    // 级联选择器选择值发生改变，seletedKeys也会被更新
    parentCateChanged () {
      console.log(this.selectedCateKeys)
      const len = this.selectedCateKeys.length
      if (len > 0) {
        this.addCateForm.cat_pid = this.selectedCateKeys[len - 1]
        this.addCateForm.cat_level = len
        // 父级id为 0、1、2
        // 等级为0、1、2
        // 所以level和len总是一致
      } else {
        this.addCateForm.cat_id = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 添加分类表单提交
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) {
          return
        }

        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          this.$message.error('分类添加失败！')
          return
        }
        this.$message.success('分类添加成功！')
        this.addCateDialogVisible = false
        this.getCateList()
        console.log(res)
      })
    },
    // 添加分类对话框关闭时
    addCateDialogClose () {
      // 这句话只清空了cat_name，因为其他两个属性没有绑定在具体的表单项上
      this.$refs.addCateFormRef.resetFields()
      this.selectedCateKeys = []
      // ...
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 显示编辑分类会话框
    async showEditDialog (catId) {
      console.log(this.editCateForm)
      this.editCateForm.id = catId
      console.log('----')
      const { data: res } = await this.$http.get('categories/' + catId)
      if (res.meta.status !== 200) {
        console.log('--333--')
        this.$message.error('获取分类信息失败！')
        return
      }
      console.log(res.data)
      this.editCateForm.cat_name = res.data.cat_name
      this.editCateDialogVisible = true
    },
    // 编辑分类对话框关闭处理函数
    editCateDialogClose () {
      this.editCateForm = {}
    },
    fuckElementUIChange (e) {
      this.$forceUpdate()
    },
    // 提交分类编辑表单
    updateCate () {
      // 提交前预验证
      this.$refs.editCateFormRef.validate(async valid => {
        // 验证失败
        if (!valid) {
          return
        }
        // 验证成功，开始提交
        const { data: res } = await this.$http.put('categories/' + this.editCateForm.id, { cat_name: this.editCateForm.cat_name })
        if (res.meta.status !== 200) {
          this.$message.error('更新分类失败')
          return
        }

        this.$message.success('更新分类成功')
        this.editCateDialogVisible = false
        this.getCateList()
      })
    },
    // 删除分类
    async removeCat (id) {
      this.$confirm('确定删除分类吗?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '删除',
        cancelButtonClass: 'btn-custom-cancel',
        confirmButtonClass: 'el-button--danger',
        type: 'warning'
      }).then(async () => {
        // 开始删除
        const { data: res } = await this.$http.delete('categories/' + id)
        if (res.meta.status !== 200) {
          this.$message.error('删除失败！')
          return
        }
        this.$message.success('删除成功！')
        this.getCateList()
      }).catch(() => {
        // 取消删除
        this.$message.info('已取消删除')
      })
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
.el-cascader {
  width: 100%;
}
</style>
