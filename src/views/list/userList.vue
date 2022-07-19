<template>
  <div>
    <!-- 头部 -->
    <div class="header">
      <Breadcrumb list="用户列表" manage="用户管理"></Breadcrumb>
    </div>
    <!-- 主体  -->
    <!-- 搜索框  -->
    <div class="card">
      <el-row :gutter="20" type="flex">
        <el-col :span="8">
          <el-input v-model="user.query" placeholder="请输入内容">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUser"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialog = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格 -->
      <template>
        <el-table :data="tableData" border="">
          <el-table-column type="index" label="#" min-width="50px">
          </el-table-column>
          <el-table-column prop="username" label="姓名" min-width="80px">
          </el-table-column>
          <el-table-column prop="mobile" label="电话" min-width="115px">
          </el-table-column>
          <el-table-column prop="role_name" label="角色" min-width="95px">
          </el-table-column>
          <el-table-column prop="mg_state" label="状态" min-width="80px">
            <template v-slot="scope">
              <el-switch
                v-model="scope.row.mg_state"
                @change="fn(scope.row.id, scope.row.mg_state)"
                ref="table"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="180px">
            <template v-slot="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="userDetial(scope.row.id)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delopen(scope.row.id)"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="getName(scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页 -->
      <template>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="user.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="user.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </template>
      <!-- 添加用户弹窗 -->
      <el-dialog
        title="添加用户对话框"
        :visible.sync="addDialog"
        ref="addDialog"
        @close="handleAddClose"
      >
        <el-form :model="form" :rules="rules" ref="AddForm">
          <el-form-item label="用户名" label-width="80px" prop="username">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" label-width="80px" prop="password">
            <el-input v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" label-width="80px" prop="email">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" label-width="80px" prop="mobile">
            <el-input v-model="form.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialog = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改用户信息弹窗 -->
      <el-dialog title="修改用户信息" :visible.sync="changeUser">
        <el-form :model="userdetial" :rules="rules" ref="userdetial">
          <el-form-item label="用户名" label-width="80px">
            <el-input v-model="userdetial.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" label-width="80px" prop="email">
            <el-input v-model="userdetial.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" label-width="80px" prop="mobile">
            <el-input v-model="userdetial.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="changeUser = false">取 消</el-button>
          <el-button type="primary" @click="changeUserDetial">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分配角色弹窗 -->
      <el-dialog
        title="分配角色"
        :visible.sync="nameList"
        @close="handleSelectClose"
      >
        <p>当前的用户:{{ userInfo.username }}</p>
        <p>当前的管理员:{{ userInfo.role_name }}</p>
        <p>
          <el-select v-model="selectedid">
            <el-option
              v-for="item in namelist"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
        <div slot="footer" class="dialog-footer">
          <el-button @click="nameList = false">取 消</el-button>
          <el-button type="primary" @click="changeName">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { validateMobile, validateEmail } from '@/utils/validate'
import { getUser, addUser, changeState, getUserDetial, changeUserDetial, delUser, getName, changeName } from '@/api/user'
export default {
  name: 'userList',
  created () { this.getUser() },
  // 表单正则校验
  data () {
    const validateMobileFn = (rule, value, callback) => {
      if (validateMobile(value)) {
        callback()
      } else {
        callback(new Error('手机号格式不正确'))
      }
    }
    const validateEmailFn = (rule, value, callback) => {
      if (validateEmail(value)) {
        callback()
      } else {
        callback(new Error('邮箱格式不正确'))
      }
    }
    return {
      tableData: [],
      user: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      addDialog: false,
      changeUser: false,
      nameList: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      userdetial: {
        email: '',
        mobile: '',
        id: ''
      },
      namelist: {
      },
      userInfo: {},
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
        ],
        email: [
          { required: true, message: '请输入邮箱号', trigger: 'blur' }, {
            validator: validateEmailFn, trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' }, {
            validator: validateMobileFn, trigger: 'blur'
          }
        ]
      },
      selectedid: ''
    }
  },
  methods: {
    // 获取用户数据列表
    async getUser () {
      try {
        const res = await getUser(this.user)
        console.log(res)
        this.tableData = res.data.data.users
        this.total = res.data.data.total
      } catch (error) {
        console.log(error)
      }
    },
    // 添加用户
    async addUser () {
      try {
        await this.$refs.addDialog.validate()
        console.log('校验成功')
        try {
          const res = await addUser(this.form)
          console.log(res)
          this.getUser()
          this.addDialog = false
        } catch (error) {
          this.$message.error('输入错误')
        }
      } catch (error) {
        this.$message.error('表单验证失败')
      }
    },
    // 切换用户状态
    async fn (id, type) {
      try {
        const res = await changeState({
          uid: id, type: type
        })
        console.log(res)
      } catch (error) {
        this.$message.error('用户切换状态失败')
      }
      this.$message({
        message: '用户状态切换成功',
        type: 'success'
      })
    },
    // 切换分页每页页数
    handleSizeChange (val) {
      this.user.pagesize = val
      this.getUser()
    },
    // 切换分页页数
    handleCurrentChange (val) {
      this.user.pagenum = val
      this.getUser()
    },
    // 获取用户的详细信息
    async userDetial (id) {
      const res = await getUserDetial(id)
      // console.log(res)
      this.userdetial = res.data.data
      this.changeUser = true
    },
    // 修改用户的详细信息
    async changeUserDetial () {
      try {
        await this.$refs.userdetial.validate()
        console.log('校验成功')
        try {
          this.changeUser = false
          const res = await changeUserDetial(this.userdetial)
          console.log(res)
          this.getUser()
          this.$message.success('用户信息更新成功')
        } catch (error) {
          console.log(error)
        }
      } catch (error) {
        this.$message.error('表单验证失败')
      }
    },
    // 删除用户
    async delopen (id) {
      const res = await delUser(id)
      console.log(res)
      this.getUser()
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 获得角色列表
    async getName (user) {
      console.log(user)
      const res = await getName()
      console.log(res)
      this.nameList = true
      this.namelist = res.data.data
      this.userInfo = user
    },
    // 更改角色
    async changeName () {
      if (!this.selectedid) {
        this.$message.error('请分配新角色')
      }
      const res = await changeName({
        id: this.userInfo.id,
        rid: this.selectedid
      })
      console.log(res)
      if (res.data.meta.status === 500) {
        this.$message.success('分配角色成功')
        this.nameList = false
        this.selectedid = ''
      } else {
        this.$message.error('分配角色失败')
      }
    },
    // 重置添加用户的表单信息
    handleAddClose () {
      this.$refs.AddForm.resetFields()
    },
    // 重置修改角色的选框信息
    handleSelectClose () {
      this.selectedid = ''
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
.card {
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;
}
.el-table {
  margin-top: 20px;
}
</style>
