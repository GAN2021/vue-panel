<template>
  <div class="login_container">
    <div class="login_box">
      <div class="login_logo">
        <img src="../assets/logo.png" alt />
      </div>
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
    border:1px solid #ddd;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform:translate(-50%,-50%);

    img {
      height: 100%;
      width: 100%;
      background-color: #eee;
      border-radius: 50%;
    }
  }
}
</style>
