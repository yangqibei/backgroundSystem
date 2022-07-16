<template>
  <div>
    <div class="header">
      <Breadcrumb list="角色列表" manage="权限管理"></Breadcrumb>
    </div>
    <div class="main">
      <el-row :gutter="20" type="flex">
        <el-col :span="8">
          <el-input v-model="findId" placeholder="请输入角色id值">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="findNameById"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialog = true" class="addbtn"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <template>
        <el-table :data="tableData" border="">
          <el-table-column type="expand" default-expand-all="true">
            <template slot-scope="props">
              <el-row
                v-for="item1 in props.row.children"
                :key="item1.id"
                class="bdbottom border"
              >
                <!-- 渲染一级权限 -->
                <el-col :span="5"
                  ><el-tag>{{ item1.authName }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 渲染二三级路由 -->
                <el-col :span="19">
                  <el-row
                    v-for="item2 in item1.children"
                    :key="item2.id"
                    class="bdbottom"
                  >
                    <el-col :span="5">
                      <el-tag type="success">{{ item2.authName }}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 渲染3级路由 -->
                    <el-col :span="19">
                      <el-tag
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(item3.id, props.row.id, props.row)"
                      >
                        {{ item3.authName }}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#" min-width="50px">
          </el-table-column>
          <el-table-column prop="roleName" label="角色名称" min-width="120px">
          </el-table-column>
          <el-table-column prop="roleDesc" label="角色描述" min-width="125px">
          </el-table-column>
          <el-table-column label="操作" min-width="120px">
            <template v-slot="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="emitname(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delnames(scope.row.id)"
                >删除</el-button
              >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="getTree(scope.row)"
                >分配权限</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 弹出层 -->
      <el-dialog :visible.sync="centerDialogVisible" width="50%" center>
        <h4>分配权限</h4>
        <el-tree
          :data="treedata"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="tree"
          highlight-current
          :default-checked-keys="defkeys"
          :props="defaultProps"
        >
        </el-tree>

        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeName">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="添加用户对话框" :visible.sync="addDialog">
        <el-form :model="form" :rules="rules">
          <el-form-item label="角色名称" label-width="80px" prop="roleName">
            <el-input v-model="form.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" label-width="80px" prop="roleDesc">
            <el-input v-model="form.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialog = false">取 消</el-button>
          <el-button type="primary" @click="AddNames">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="修改用户对话框"
        :visible.sync="emitDialog"
        ref="editform"
      >
        <el-form :model="emitform" :rules="rules">
          <el-form-item label="用户id" label-width="80px" prop="id">
            <el-input v-model="emitform.id" disabled> </el-input>
          </el-form-item>
          <el-form-item label="角色名称" label-width="80px" prop="roleName">
            <el-input v-model="emitform.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" label-width="80px" prop="roleDesc">
            <el-input v-model="emitform.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="emitDialog = false">取 消</el-button>
          <el-button type="primary" @click="editName">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getName, getTree, delRightID, changeNameList, addNames, delNames, editNames, findNameById } from '@/api/user'
export default {
  name: 'nameList',
  created () {
    this.getName()
  },
  data () {
    return {
      tableData: [],
      centerDialogVisible: false,
      treedata: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      defkeys: [],
      roleId: '',
      form: {
        roleName: '',
        roleDesc: ''
      },
      emitform: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          {
            min: 3, max: 8, message: '长度在3到8之间', trigger: 'blur'
          }
        ],
        roleDesc: [
          {
            min: 3, max: 8, message: '长度在3到8之间', trigger: 'blur'
          }
        ]
      },
      addDialog: false,
      emitDialog: false,
      findId: ''
    }
  },
  methods: {
    async getName () {
      try {
        const res = await getName()
        console.log(res)
        this.tableData = res.data.data
      } catch (error) {
        console.log(error)
      }
    },
    async getTree (obj) {
      this.roleId = obj.id
      const res = await getTree()
      console.log(res)
      this.treedata = res.data.data
      this.defkeys = []
      this.getKeys(obj, this.defkeys)
      this.centerDialogVisible = true
    },
    // 利用递归得到三级权限
    getKeys (obj, arr) {
      if (!obj.children) {
        return arr.push(obj.id)
      }
      obj.children.forEach(item => this.getKeys(item, arr)
      )
    },
    // 点击tag标签关闭
    handleClose (rightId, roleId, list) {
      this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await delRightID({
          roleId: roleId, rightId: rightId
        })
        console.log(res)
        list.children = res.data.data
        // this.getName()
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
    async changeName () {
      this.centerDialogVisible = true
      const res1 = this.$refs.tree.getCheckedKeys()
      const res2 = this.$refs.tree.getHalfCheckedKeys()
      const arr = [...res1, ...res2]
      const arr1 = arr.join(',')
      console.log('1', arr1)
      try {
        const res = await changeNameList({
          roleId: this.roleId, rids: arr1
        })
        console.log(res)
        this.$message.success('更新成功')
        this.centerDialogVisible = false
        this.getName()
      } catch (error) {
        console.log(error)
      }
    },
    async AddNames () {
      await addNames(this.form)
      this.$message.success('添加成功')
      this.addDialog = false
      this.form = {}
      this.getName()
    },
    delnames (id) {
      console.log(id)
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delNames(id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getName()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    emitname (obj) {
      this.emitDialog = true
      console.log(obj)
      this.emitform.id = obj.id
      this.emitform.roleName = obj.roleName
      this.emitform.roleDesc = obj.roleDesc
    },
    async editName () {
      try {
        await this.$refs.editform.validate()
        console.log('校验成功')
        try {
          await editNames(this.emitform)
          this.getName()
          this.$message.success('角色更新成功')
          this.emitDialog = false
        } catch (error) {
          this.$message.error('输入错误')
        }
      } catch (error) {
        this.$message.error('表单验证失败')
      }
    },
    async findNameById () {
      const res = await findNameById(this.findId)
      console.log(res)
      this.tableData = []
      // this.tableData = res.data.data
      this.tableData.push(res.data.data)
      this.findId = ''
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
.main {
  background-color: #fff;
  padding: 20px;
  margin-top: 20px;
  .addbtn {
    margin-bottom: 20px;
  }
  :deep(.el-table__expanded-cell) {
    padding: 20px 50px;
  }
  :deep(.el-tag) {
    margin: 5px;
  }
  :deep(.bdbottom) {
    display: flex;
    align-items: center;
  }
  :deep(.border) {
    border-bottom: 1px solid #eee;
  }
}
:deep(.el-table-column) {
  .cell {
    font-size: 12px !important;
  }
}
</style>
