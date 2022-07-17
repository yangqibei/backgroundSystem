<template>
  <div class="login-container">
    <div class="form-box">
      <div class="avatar">
        <img src="@/assets/logo.png" alt="" />
      </div>
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item class="btn-item">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  created () { },
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          {
            min: 3, max: 8, message: '长度在3到8之间', trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          {
            min: 3, max: 8, message: '长度在3到8之间', trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    reset () {
      this.$refs.loginFormRef.resetFields()
    },
    // 登录接口
    async login () {
      try {
        await this.$refs.loginFormRef.validate()
        // console.log('校验成功')
        try {
          const res = await login(this.loginForm)
          console.log(res)
          this.$store.commit('setToken', res.data.data.token) // 请求回来的token保存在vuex的state中的setUser里
          this.$message.success('登录成功')
          this.$router.push('/home')
        } catch (error) {
          this.$message.error('账号密码错误')
        }
      } catch (error) {
        this.$message.error('登录表单验证失败')
      }
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
.login-container {
  background-color: #2b4b6b;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .form-box {
    width: 450px;
    height: 300px;
    padding: 100px 15px;
    box-sizing: border-box;
    background-color: #fff;
    .btn-item {
      text-align: right;
    }
    .avatar {
      position: absolute;
      top: 22%;
      right: 47%;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100px;
      height: 100px;
      background-color: #fff;
      border-radius: 50%;
      box-shadow: 0 0 10px green;
      z-index: 2;
    }
    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }
  }
}
</style>
