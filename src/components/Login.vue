<template>
  <div class="login_container">
    <div class="login_box">
      <div class="login_logo">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登录表单 -->
      <el-form class="login_form">
        <!-- 用户名 -->
        <el-form-item>
          <el-input prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item>
          <el-input prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary">登录</el-button>
          <el-button type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {

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
.login_form{
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 20px;
  // 知道它的作用吗？
  box-sizing: border-box;
}
.btns{
  display: flex;
  justify-content: flex-end ;
}
</style>
