<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/users'}">用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <!-- 列表上方的功能区 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入要查询的用户名"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
            size="medium"
          >
            <el-button @click="getUserList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="addDialogVisible=true" type="primary" size="medium">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="创建时间" prop="created_time"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="启/禁用">
          <template v-slot="scopeData">
            <el-switch v-model="scopeData.row.mg_state" @change="changeUserState(scopeData.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot="scopeData">
            <!-- 编辑按钮 -->
            <el-button
              size="mini"
              @click="showEditDialog(scopeData.row.id)"
              type="primary"
              icon="el-icon-edit"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              type="danger"
              @click="removeUser(scopeData.row.id)"
              icon="el-icon-delete"
            ></el-button>
            <!-- 分配权限按钮 -->
            <el-tooltip effect="dark" content="权限分配" placement="top" :enterable="false">
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                @click="showSetRoleDialog(scopeData.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
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

    <!-- 用户添加对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" @close="addDialogClose" width="50%">
      <!-- 用户添加表单 -->
      <el-form :model="addForm" ref="addFormRef" :rules="addFormRules" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addUser">提 交</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 用户编辑对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" @close="editDialogClose" width="50%">
      <!-- 用户编辑表单 -->
      <el-form :model="editForm" ref="editFormRef" :rules="editFormRules" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateUser">提 交</el-button>
        <el-button @click="editDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 角色分配对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" @close="setRoleDialogClose">
      <p>当前的用户：{{this.userInfo.username}}</p>
      <p>当前的角色：{{this.userInfo.role_name}}</p>
      <p>
        要分配的新角色：
        <el-select v-model="newRoleId" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setRoleForUser">确 定</el-button>
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 验证邮箱的规则
    var emailValidator = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) return cb()
      cb(new Error('不是合法的邮箱'))
    }
    // 验证手机号的规则
    var mobileValidator = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) return cb()
      cb(new Error('不是合法的手机号'))
    }

    return {
      // 用户列表查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      // [添加用户]对话框可见性
      addDialogVisible: false,
      // [添加用户]表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // [添加用户]的验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在3~10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度在6~15个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: emailValidator, message: '邮箱格式不正确', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: mobileValidator, message: '手机号格式不正确', trigger: 'blur' }
        ]
      },
      // [编辑用户]对话框可见性
      editDialogVisible: false,
      // [编辑用户]表单数据
      editForm: {},
      // [编辑用户]的验证规则
      editFormRules: {
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: emailValidator, message: '邮箱格式不正确', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: mobileValidator, message: '手机号格式不正确', trigger: 'blur' }
        ]
      },
      // 角色分配对话框可见性
      setRoleDialogVisible: false,
      // 待分配的角色的用户
      userInfo: {},
      // 角色列表
      roleList: [],
      // 要分配的角色id
      newRoleId: ''
    }
  },
  methods: {
    // 获取用户列表数据
    async getUserList () {
      // 这个{ params : ... } ?params?相当于命名参数
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        this.$message.error('用户列表数据获取失败！')
        return
      }
      this.userList = res.data.users
      this.total = res.data.total
      console.log(this.userList)
      console.log(this.total)
    },
    // 监听switch开关的状态
    async changeUserState (userInfo) {
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('修改用户状态失败')
      }
      this.$message.success('修改成功')
      userInfo = res.data
    },
    // 分页大小变化处理函数
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 当前页码变化处理函数
    handleCurrentChange (newCurrent) {
      this.queryInfo.pagenum = newCurrent
      this.getUserList()
    },
    // [添加用户]对话框关闭处理函数
    addDialogClose () {
      // 重置[添加用户]表单
      this.$refs.addFormRef.resetFields()
    },
    // [添加用户]表单的提交按钮
    addUser () {
      // 提交前预验证
      this.$refs.addFormRef.validate(async valid => {
        // 预验证失败，退出提交
        if (!valid) {
          return
        }

        // 预验证成功，开始提交
        const { data: res } = await this.$http.post('users', this.addForm)
        // 失败
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败！')
          return
        }
        // 成功
        this.$message.success('添加用户成功！')
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    // [添加用户]对话框关闭处理函数
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
      this.editForm = {}
    },
    // [编辑用户]对话框显示
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        this.$message.error('获取用户信息失败！')
        return
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // [编辑用户]表单的提交按钮
    updateUser () {
      // 提交前预验证
      this.$refs.editFormRef.validate(async valid => {
        // 验证失败
        if (!valid) {
          return
        }
        // 验证成功，开始提交
        const { data: res } = await this.$http.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
        if (res.meta.status !== 200) {
          this.$message.error('更新用户失败')
          return
        }
        this.$message.success('更新用户成功')
        this.editDialogVisible = false
        this.editForm = {}
        this.getUserList()
      })
    },
    // 删除用户
    removeUser (id) {
      this.$confirm(`确定删除id为${id}的用户吗?`, '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '删除',
        cancelButtonClass: 'btn-custom-cancel',
        confirmButtonClass: 'el-button--danger',
        type: 'warning'
      }).then(async () => {
        // 开始删除
        const { data: res } = await this.$http.delete('users/' + id)
        if (res.meta.status !== 200) {
          this.$message.error('删除失败！')
          return
        }
        this.$message.success('删除成功！')
        this.getUserList()
      }).catch(() => {
        // 取消删除
        this.$message.info('已取消删除')
      })
    },
    // 显示角色分配对话框
    async showSetRoleDialog (user) {
      this.userInfo = user
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        this.$message.error('获取角色列表失败！')
        return
      }
      this.roleList = res.data
      this.setRoleDialogVisible = true
    },
    // 向服务器发送分配角色请求
    async setRoleForUser () {
      if (this.newRoleId) {
        const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.newRoleId })
        if (res.meta.status !== 200) {
          this.$message.error('分配角色失败！')
        } else {
          this.$message.success('分配角色成功！')
          this.setRoleDialogVisible = false
          this.getUserList()
        }
        return
      }
      this.$message.error('请选择要分配的角色！')
    },
    // 角色分配对话框关闭
    setRoleDialogClose () {
      this.newRoleId = ''
      this.userInfo = {}
    }
  },
  created () {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
</style>
