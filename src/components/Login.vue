<template>
  <div class="login_container">
    <div class="login_box">
      <div class="login_logo">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登录表单 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click.prevent="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 登录表单数据
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 登录表单验证规则
      loginFormRules: {
        username: [
          { required: true, message: '用户不能为空', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度必须在 3 到 10 个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度必须在 6 到 15 个字符之间', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置表单和验证提示
    resetLoginForm: function () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        // 预验证失败
        if (!valid) {
          return
        }
        // 发起登录请求
        const { data: res } = await this.$http.post('login', this.loginForm)
        // 登录失败
        if (res.meta.status !== 200) {
          this.$message.error('登录失败')
          return
        }
        // 登录成功
        this.$message({ message: '登录成功', type: 'success' })
        // 存储token
        window.sessionStorage.setItem('token', res.data.token)
        // 跳转到主页
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #105090; /* 不支持线性的时候显示 */
  background-image: linear-gradient(
    to bottom right,
    #276db3 20%,
    rgba(33, 161, 184, 0.842),
    #0e2f50
  );
  height: 100%;
}
.login_box {
  background-color: #fff;
  width: 450px;
  height: 300px;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .login_logo {
    width: 130px;
    height: 130px;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    border: 1px solid #ddd;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);

    img {
      height: 100%;
      width: 100%;
      background-color: #eee;
      border-radius: 50%;
    }
  }
}
.login_form {
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 20px;
  // 知道它的作用吗？
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
