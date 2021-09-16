<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/roles'}">角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" size="medium">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" border stripe>
        <!-- 展开列（角色权限展示） -->
        <el-table-column type="expand">
          <template v-slot="scopeData">
            <el-row
              v-for="(item1,i1) in scopeData.row.children"
              :key="item1.id"
              :class="['bdbottom',i1===0?'bdtop':'','vcenter']"
            >
              <!-- 第一个列区域渲染1级权限 -->
              <el-col :span="5">
                <el-tag closable>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 第二个列区域渲染2级、3级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                  :class="[i2===0?'':'bdtop','vcenter']"
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
                      @close="removeRightById(scopeData.row,item3.id)"
                      closable
                    >{{item3.authName}}</el-tag>
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
          <template v-slot>
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: []
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
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
</style>
