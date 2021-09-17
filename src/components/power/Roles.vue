<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/roles' }">角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button @click="showAddRoleDialog" type="primary" size="medium">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" border stripe>
        <!-- 展开列（角色权限展示） -->
        <el-table-column type="expand">
          <template v-slot="scopeData">
            <el-row
              v-for="(item1, i1) in scopeData.row.children"
              :key="item1.id"
              :class="['rowbottom', i1 === 0 ? 'rowtop' : '', 'vcenter']"
            >
              <!-- 第一个列区域渲染1级权限 -->
              <el-col :span="5">
                <el-tag :disable-transitions="false" closable>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 第二个列区域渲染2级、3级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'rowtop', 'vcenter']"
                >
                  <!-- 第二列区下第一列区渲染2级权限 -->
                  <el-col :span="5">
                    <el-tag type="success" closable>{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!-- 第二列区下第一列区渲染3级权限 -->
                  <el-col :span="19">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRightById(scopeData.row, item3.id)"
                      closable
                    >{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
              <!-- 第二列区结束 -->
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300">
          <template v-slot="scopeData">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRole(scopeData.row.id)"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scopeData.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 权限分配对话框 -->
      <el-dialog
        title="提示"
        :visible.sync="setRightDialogVisible"
        @close="setRightDialogClose"
        width="50%"
      >
        <!-- 权限树形控件 -->
        <el-tree
          ref="treeRef"
          :data="rightsTree"
          :props="rightsTreeProps"
          node-key="id"
          :default-checked-keys="defKeys"
          :default-expanded-keys="defKeys"
          show-checkbox
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updateRightsForRole">确 定</el-button>
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </el-card>

    <!-- 角色添加对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addRoleDialogVisible"
      @close="addRoleDialogClose"
      width="50%"
    >
      <!-- 角色添加表单 -->
      <el-form
        :model="addRoleForm"
        ref="addRoleFormRef"
        :rules="addRoleFormRules"
        label-width="70px"
      >
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addRole">提 交</el-button>
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 角色列表
      roleList: [],
      // 权限分配对话框显示/隐藏
      setRightDialogVisible: false,
      // 树形控件绑定对象（所有权限tree）
      rightsTree: [],
      // 树形控件默认选中的权限id集合
      defKeys: [],
      // 树形控件属性绑定
      rightsTreeProps: {
        label: 'authName',
        children: 'children'
      },
      // 待分配权限的角色
      roleId: '',
      // [添加用户]对话框可见性
      addRoleDialogVisible: false,
      // [添加用户]表单
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      // [添加用户]表单规则
      addRoleFormRules: {
        roleName: [
          { required: true, message: '角色名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表
    async getRoleList () {
      const { data: res } = await this.$http.get('roles')

      if (res.meta.status !== 200) {
        this.$message.error('角色列表获取失败')
        return
      }
      this.$message.success('角色列表获取成功')
      this.roleList = res.data
    },
    // 通过id删除角色上的权限
    removeRightById (role, rightId) {
      // 删除确认提示
      this.$confirm(`从角色【${role.roleName}】中删除该权限, 是否继续?`, '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        confirmButtonClass: 'el-button--danger',
        type: 'warning'
      }).then(async () => {
        // 确认删除，开始删除
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status !== 200) {
          this.$message.error('删除失败')
          return
        }
        this.$message.success('删除成功')
        // 将删除后的返回的权限信息赋值给本地角色
        // 无需重新请求加载角色列表
        role.children = res.data
      }).catch(() => {
        // 取消删除
        this.$message.info('已取消删除')
      })

      console.log(role)
      console.log(rightId)
    },
    // 显示权限分配对话框
    async showSetRightDialog (role) {
      // 由于roleId，只在此对话框中使用
      // 因此不需要在退出对话框后清空
      this.roleId = role.id
      // 获取并绑定权限列表（树形结构）
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        this.$message.error('获取权限列表失败')
      }
      this.$message.success('获取权限列表成功')
      this.rightsTree = res.data

      // 获取叶子id数组
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 获取一个角色的叶子权限的id集合（arr）
    getLeafKeys (node, arr) {
      // 如果没有children说明是叶子级权限，加入数组
      if (!node.children) {
        return arr.push(node.id)
      }
      // 不是叶子，则进行递归
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 更新角色的权限
    async updateRightsForRole () {
      // 获取选中节点和半选中节点的id集合
      const checkedKeys = this.$refs.treeRef.getCheckedKeys()
      const halfCheckedKeys = this.$refs.treeRef.getHalfCheckedKeys()
      const rightIds = [...checkedKeys, ...halfCheckedKeys]
      // 构造地址和参数
      const url = `roles/${this.roleId}/rights`
      const param = { rids: rightIds.join(',') }
      // 发起请求
      const { data: res } = await this.$http.post(url, param)

      if (res.meta.status !== 200) {
        return this.$message.error('权限设置失败')
      }
      this.$message.success('权限设置成功')
      this.setRightDialogVisible = false
      this.getRoleList()
    },

    // 权限分配对话框关闭事件处理函数
    setRightDialogClose () {
      // 这个一定要清空，不清空的话
      // 在增加角色权限时，没有bug
      // 在删除角色的权限时，会发生再次显示时没有删除掉的bug
      this.defKeys = []
      // 虽然rightsTree存储的是权限列表，但是还是会有变化的可能，要清空
      this.rightsTree = []
    },
    // 显示[添加角色]对话框
    showAddRoleDialog () {
      this.addRoleDialogVisible = true
    },
    // [添加角色]对话框关闭处理函数
    addRoleDialogClose () {
      this.addRoleForm = {}
    },
    // [添加角色]操作
    addRole () {
      this.$refs.addRoleFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('roles', this.addRoleForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加角色失败')
          return
        }
        this.$message.success('添加角色成功')
        this.addRoleDialogVisible = false
        this.getRoleList()
      })
    },
    // 删除角色
    removeRole (id) {
      // 删除确认提示
      this.$confirm('删除该角色, 是否继续?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        confirmButtonClass: 'el-button--danger',
        type: 'warning'
      }).then(async () => {
        // 确认删除，开始删除
        const { data: res } = await this.$http.delete(`roles/${id}`)
        if (res.meta.status !== 200) {
          this.$message.error('删除失败')
          return
        }
        this.$message.success('删除成功')
        this.getRoleList()
      }).catch(() => {
        // 取消删除
        this.$message.info('已取消删除')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.rowbottom {
  border-bottom: #ccc solid 1px;
}
.rowtop {
  border-top: #ccc solid 1px;
}
</style>
