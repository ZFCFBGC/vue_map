<template>
  <div class="login">
    <div class="title">地图轨迹练习官网</div>
    <div class="container">
      <div class="userName">
        <el-input v-model="userName" placeholder="请输入账号"></el-input>
      </div>
      <div class="password">
        <el-input v-model="passWord" placeholder="请输入密码"></el-input>
      </div>
      <div class="loginBtn" @click="goLogin">登录</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userName: "",
      passWord: "",
    };
  },
  mounted() {},
  methods: {
    goLogin() {
      console.log("登录");
      try {
        if (!this.userName) {
          throw "请输入用户名";
        }
        if (!this.passWord) {
          throw "请输入密码";
        }
      } catch (error) {
        window.alert(error);
        return;
      }
      var url = "/user/login.do?t=" + new Date().getTime();
      var param = {
        name: this.userName,
        password: this.passWord,
        lang: 'cn',
      };
      this.$client.post(url, param).then((res) => {
        console.log('登录：',res)
        if(res.ret){
          if(res.data){
            this.$cookie.set("token", res.data.token);
            this.$router.push({ path: "/index" });
          }else{
            window.alert('未知错误，token不存在')
          }
        }else{
          window.alert('登录失败')
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  .title {
    width: 100%;
    height: 62px;
    line-height: 62px;
    font-size: 18px;
    color: #333;
    font-weight: bold;
    text-align: center;
  }
  /deep/.container {
    width: 100%;
    height: 594px;
    background: url(../../assets/images/background.png) no-repeat center center;
    position: relative;
    .userName {
      position: absolute;
      left: 838px;
      top: 218px;
      width: 280px;
    }
    .password {
      position: absolute;
      left: 838px;
      top: 282px;
      width: 280px;
    }
    .loginBtn {
      width: 357px;
      height: 44px;
      line-height: 44px;
      color: #fff;
      text-align: center;
      background: #0080ff;
      cursor: pointer;
      border-radius: 30px;
      font-size: 20px;
      position: absolute;
      left: 777px;
      top: 382px;
    }
    .el-input__inner {
      height: 43px;
      line-height: 43px;
      border-left: 0 none;
    }
  }
}
</style>