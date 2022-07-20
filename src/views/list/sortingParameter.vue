<template>
  <div>
    <div class="header">
      <Breadcrumb list="分类参数" manage="商品管理"></Breadcrumb>
    </div>
    <div class="card">
      <el-alert title="警告提示的文案" type="warning" :closable="false">
        <template slot="title">
          <i class="el-icon-warning"></i>注意：只允许为第三级分类设置相关参数！
        </template>
      </el-alert>
      <template>
        <el-row>
          <el-col>
            <span>选择商品分类：</span>
            <!-- 选择商品分类的级联选择框 -->
            <el-cascader
              v-model="selectedKeys"
              :options="goodslist"
              :props="props"
              @change="handleChanged()"
              clearable
            ></el-cascader>
          </el-col>
        </el-row>
      </template>
      <template>
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane label="动态参数" name="first">
            <template
              ><el-button
                type="primary"
                size="mini"
                @click="addmanydialog = true"
                >添加参数</el-button
              ></template
            >
            <template>
              <el-table :data="manyData" border="">
                <el-table-column type="expand" label="#" min-width="50px">
                </el-table-column>
                <el-table-column type="index" label="#" min-width="50px">
                </el-table-column>
                <el-table-column
                  prop="attr_name"
                  label="分类名称"
                  min-width="80px"
                >
                </el-table-column>
                <el-table-column label="操作" min-width="80px">
                  <template v-slot="scope">
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      size="mini"
                      @click="fn(scope.row)"
                      >编辑</el-button
                    >
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      @click="del(scope.row.attr_id)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-tab-pane>
          <el-tab-pane label="静态参数" name="second">
            <template
              ><el-button type="primary" size="mini"
                >添加属性</el-button
              ></template
            >
            <template>
              <el-table :data="onlyData" border="">
                <el-table-column type="expand" label="#" min-width="50px">
                </el-table-column>
                <el-table-column type="index" label="#" min-width="50px">
                </el-table-column>
                <el-table-column
                  prop="attr_name"
                  label="分类名称"
                  min-width="80px"
                >
                </el-table-column>
                <el-table-column label="操作" min-width="80px">
                  <template v-slot="scope">
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      size="mini"
                      @click="fn(scope.row)"
                      >编辑</el-button
                    >
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      @click="del(scope.row.id)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-tab-pane>
        </el-tabs>
      </template>
      <!-- 添加参数 -->
      <el-dialog title="收货地址" :visible.sync="addmanydialog" close="reset">
        <el-form :model="addmany" :rules="rules" ref="Addform">
          <el-form-item label="参数名称" label-width="80px" prop="name">
            <el-input v-model="addmany.name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addmanydialog = false">取 消</el-button>
          <el-button type="primary" @click="Addmany">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑参数 -->
      <el-dialog
        title="修改参数"
        :visible.sync="emitDialog"
        ref="editform"
        close="reset1"
      >
        <el-form :model="editForm" :rules="rules" ref="emitDialogRef">
          <el-form-item label="分类id" label-width="80px" prop="attr_id">
            <el-input v-model="editForm.attrId" disabled> </el-input>
          </el-form-item>
          <el-form-item label="分类名称" label-width="80px" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
          <el-form-item label="参数属性" label-width="80px" prop="attr_vals">
            <el-input v-model="editForm.attr_vals"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="emitDialog = false">取 消</el-button>
          <el-button type="primary" @click="editcategories">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getcategoriesList, getCateAttributes, addcategories, delcategories, editcategories } from '@/api/category'
export default {
  name: 'sortparams',
  created () {
    this.getcategoriesList()
  },
  data () {
    return {
      activeName: 'first',
      goodslist: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        leaf: 'cat_level',
        expandTrigger: 'hover'
      },
      // 选中的分类id
      selectedKeys: [],
      manyData: [],
      onlyData: [],
      addmany: {
        name: ''
      },
      addonly: {
        name: ''
      },
      addmanydialog: false,
      rules: {
        name: [{ required: true, message: '参数不能为空', trigger: 'blur' }]
      },
      editForm: {
        id: null,
        attrId: '',
        attr_sel: '',
        attr_vals: '',
        attr_name: ''
      },
      emitDialog: false
    }
  },
  methods: {
    // 获得所有商品分类列表
    async getcategoriesList () {
      const res = await getcategoriesList()
      console.log(res)
      this.goodslist = res.data.data
    },
    // 商品级联选择发生变化时调用这个函数
    handleChanged () {
      this.getTableData()
    },
    // 得到表单数据
    async getTableData () {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
      }
      console.log(this.selectedKeys)
      const res = await getCateAttributes({
        id: this.selectedKeys[2], sel: this.activeName === 'first' ? 'many' : 'only'
      })
      console.log(res)
      // 根据不同tab栏分别赋值不同的对象
      if (this.activeName === 'first') {
        this.manyData = res.data.data
      } else {
        this.onlyData = res.data.data
      }
    },
    // 当tab栏切换时，得到对应的数据
    handleTabClick () {
      console.log(this.activeName)
      this.getTableData()
    },
    // 编辑参数
    fn (obj) {
      console.log(obj)
      this.editForm.attrId = obj.attr_id
      this.editForm.attr_name = obj.attr_name
      this.editForm.id = obj.cat_id
      this.editForm.attr_vals = obj.attr_vals
      this.editForm.attr_sel = obj.attr_sel
      this.emitDialog = true
    },
    // 发起编辑参数的ajaxqingqiu
    async editcategories () {
      console.log(this.editForm)
      const res = await editcategories(this.editForm)
      console.log(res)
      this.getTableData(this.editForm)
      this.emitDialog = false
    },
    // 添加many参数
    async Addmany () {
      const res = await addcategories({ id: this.selectedKeys[2], attr_name: this.addmany.name, attr_sel: 'many' })
      if (res.data.meta.status === 201) {
        this.$message.success('创建成功')
      }
      this.addmanydialog = false
      this.getTableData(this.selectedKeys[2])
    },
    // 重置表单
    reset () {
      this.$refs.Addform.resetFields()
    },
    reset1 () {
      this.$refs.emitDialogRef.resetFields()
    },
    // 删除分类
    del (id) {
      console.log(id)
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delcategories({ id: this.selectedKeys[2], attrid: id })
        this.getTableData(this.selectedKeys[2])
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
  .el-alert {
    margin: 20px 0;
  }
  .el-table {
    margin-top: 20px;
  }
}
</style>
