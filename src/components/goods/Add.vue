<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/goods/add'}">商品添加</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert title="添加商品信息" type="info" show-icon center :closable="false"></el-alert>

      <!-- 步骤条区域 -->
      <!-- 不转成数字好像也能工作 -->
      <el-steps :active="parseInt(activeStepIndex)" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 添加商品表单 -->
      <el-form
        :model="addForm"
        ref="addFormRef"
        :rules="addFormRules"
        label-width="70px"
        label-position="top"
      >
        <!-- tabs区域 -->
        <el-tabs
          v-model="activeStepIndex"
          tab-position="left"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <!-- tabs1 基本信息-->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="nubmer"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="nubmer"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="nubmer"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cascaderProp"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- tabs2 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="'参数： '+item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_checked_vals">
                <!-- 在页面中点击checkbox会移除v-model=中的数组元素 -->
                <!-- 所以我们使用新增了一个字段item.attr_checked_vals 确保显示和存储的分开-->
                <el-checkbox
                  size="small"
                  :label="item2"
                  v-for="(item2,i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
              <hr />
            </el-form-item>
          </el-tab-pane>
          <!-- tabs3 商品属性-->
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <!-- tabs4 商品图片-->
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <!-- tabs5 商品内容-->
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 激活步骤索引、tab名称
      // 赋值给steps时不转数字看起来也能工作
      activeStepIndex: '0',
      // 添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        // 注意后端接口需要的不是数组格式
        goods_cat: [1, 3, 6]
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        // 不过级联选择器的required验证规则似乎看不到效果，估计只能在预验证时才能看到效果
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 所有商品分类
      cateList: [],
      // 级联选择及配置
      cascaderProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 选择分类的动态参数
      manyTableData: []
    }
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        this.$message.error('获取商品分类列表失败！')
        return
      }
      this.cateList = res.data
      console.log(this.cateList)
    },
    // 商品分类级联选择器选中值变化处理函数
    handleChange () {
      // 不允许选择非三级分类
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat.length = []
        this.$message.warning('请选择三级商品分类')
      }
    },
    // Tabs切换时触发
    beforeTabLeave (newActiveName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    // 点击tab时触发
    async tabClicked () {
      console.log(this.manyTableData)
      console.log(this.activeStepIndex)
      if (this.activeStepIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: 'many'
          }
        })
        if (res.meta.status !== 200) {
          this.$message.error('动态参数获取失败！')
          return
        }
        this.$message.success('动态参数获取成功！')

        // 需要把attr_vals转成数组类型
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          // 用于防止checkbox消失
          item.attr_checked_vals = [...item.attr_vals]
        })

        // 保存到本地data()
        this.manyTableData = res.data
        console.log(this.manyTableData)
      }
    }
  },
  computed: {
    // 当前选中的三级分类ID
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
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
</style>
