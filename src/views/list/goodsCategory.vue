<template>
  <div>
    <div class="header">
      <Breadcrumb list="商品分类" manage="商品管理"></Breadcrumb>
    </div>
    <div class="card">
      <el-row :gutter="20" type="flex">
        <el-col :span="8">
          <el-input placeholder="请输入商品id已便于搜索内容" v-model="findId">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getcategoriesById"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addCategory">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <template>
        <tree-table
          :data="tableData"
          :columns="columns"
          :selection-type="false"
          :expand-type="false"
          :show-index="true"
          :border="true"
          class="table"
        >
          <!-- 是否有效 -->
          <template slot="isok" slot-scope="scope">
            <i
              v-if="scope.row.cat_deleted === false"
              class="el-icon-success"
              style="color: green"
            ></i>
            <i class="el-icon-error" v-else style="color: red"></i>
          </template>
          <!-- 排序 -->
          <template slot="order" slot-scope="scope">
            <el-tag v-if="scope.row.cat_level === 0">等级一</el-tag>
            <el-tag v-else-if="scope.row.cat_level === 1" type="success"
              >等级二</el-tag
            >
            <el-tag v-else-if="scope.row.cat_level === 2" type="warning"
              >等级三</el-tag
            >
          </template>
          <!-- 操作 -->
          <template slot="opt" slot-scope="scope">
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
              @click="delcategoriesById(scope.row.cat_id)"
              >删除</el-button
            >
          </template>
        </tree-table>
        <!-- <el-table :data="tableData" border="">
          <el-table-column type="index" label="#" min-width="50px">
          </el-table-column>
          <el-table-column prop="cat_name" label="分类名称" min-width="80px">
          </el-table-column>
          <el-table-column prop="cat_deleted" label="是否有效" min-width="80px">
            <template slot-scope="scope">
              <i v-if="scope.row.cat_deleted === false" class="el-icon-success">
              </i>
              <i v-else class="el-icon-error"></i>
            </template>
          </el-table-column>
          <el-table-column prop="cat_level" label="排序" min-width="80px">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.cat_level === 0">等级一</el-tag>
              <el-tag v-else-if="scope.row.cat_level === 1" type="success"
                >等级二</el-tag
              >
              <el-tag v-else type="warning">等级三</el-tag>
            </template>
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
                @click="delcategoriesById(scope.row.cat_id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table> -->
      </template>
      <!-- 分页 -->
      <template>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="pageInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </template>
      <!-- 添加分类 -->
      <el-dialog
        title="添加分类"
        :visible.sync="AddForm"
        width="50%"
        @close="handleAddClose"
      >
        <el-form :model="addForm" :rules="rules" ref="AddFormRef">
          <el-form-item
            label="分类名称"
            label-width="80px"
            prop="cat_name"
            style="width: 50%"
          >
            <el-input v-model="addForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类" label-width="80px">
            <el-cascader
              v-model="selectedparent"
              :options="parentCateList"
              :props="prop"
              @change="handleChange"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="AddForm = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 添加参数 -->
      <el-dialog title="修改参数" :visible.sync="editdialog">
        <el-form :model="editform" :rules="rules" ref="Addform">
          <el-form-item
            label="参数名称"
            label-width="80px"
            prop="cat_name"
            style="width: 50%"
          >
            <el-input v-model="editform.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editdialog = false">取 消</el-button>
          <el-button type="primary" @click="edit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getcategoriesList, getcategoriesById, delcategoriesById, addcategory, editGoodsCate } from '@/api/category'
export default {
  created () { this.getcategoriesList() },
  data () {
    return {
      tableData: [],
      pageInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      findId: '',
      AddForm: false,
      form: {},
      rules: {
        cat_name: [
          { required: true, message: '分类名不能为空', trigger: 'blur' }
        ]
      },
      addForm: {
        cat_name: '',
        cat_pid: '',
        cat_level: 0
      },
      // 所有的父级
      parentCateList: [],
      // 选中的父级
      selectedparent: [],
      // 添加分类中的
      prop: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        leaf: 'cat_level',
        checkStrictly: true// 父子结点互不关联
      },
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      },
      {
        label: '是否有效',
        prop: 'cat_deleted',
        // 表示将当前列定义为模板列
        type: 'template',
        // 表示当前这一列使用模板名称
        template: 'isok'
      },
      {
        label: '排序',
        // 表示将当前列定义为模板列
        type: 'template',
        // 表示当前这一列使用模板名称
        template: 'order'
      },
      {
        label: '操作',
        type: 'template',
        template: 'opt'
      }],
      editform: {
        id: '',
        cat_name: ''
      },
      editdialog: false
    }
  },
  methods: {
    // 切换分页每页页数
    handleSizeChange (val) {
      this.pageInfo.pagesize = val
      this.getcategoriesList()
    },
    // 切换分页页数
    handleCurrentChange (val) {
      this.pageInfo.pagenum = val
      this.getcategoriesList()
    },
    // 获取分类列表数据
    async getcategoriesList () {
      const res = await getcategoriesList(this.pageInfo)
      console.log(res)
      this.tableData = res.data.data.result
      this.total = res.data.data.total
      this.pagenum = res.data.data.pagenum
      this.pagesize = res.data.data.pagesize
    },
    // 编辑更改
    fn (obj) {
      console.log(obj)
      this.editdialog = true
      this.editform.id = obj.cat_id
      this.editform.cat_name = obj.cat_name
    },
    async edit () {
      await editGoodsCate(this.editform)
      this.editdialog = false
      this.getcategoriesList()
    },
    // 利用角色id获得角色
    async getcategoriesById () {
      const res = await getcategoriesById({ id: this.findId })
      console.log(res)
      this.tableData = []
      // this.tableData = res.data.data
      this.tableData.push(res.data.data)
      this.findId = ''
    },
    // 删除分类
    delcategoriesById (id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delcategoriesById(id)
        this.getcategoriesList()
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
    // 重置添加角色表单数据
    handleAddClose () {
      this.$refs.AddFormRef.resetFields()
      this.selectedparent = []
      this.addForm.cat_pid = 0
      this.addForm.cat_level = 0
    },
    // 获得所有父级分类的数据
    async addCategory () {
      const res = await getcategoriesList({ type: 2 })
      console.log(res)
      this.parentCateList = res.data.data
      this.AddForm = true
    },
    // 添加分类表单，选中值时
    handleChange () {
      console.log(this.selectedparent)
      // 如果selectedparent数组长度为0则添加的是一级分类
      // 如果selectedparent数组长度大于0则添加的是二三级分类
      if (this.selectedparent.length === 0) {
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      } else {
        this.addForm.cat_pid = this.selectedparent[0]
        this.addForm.cat_level = this.selectedparent.length
      }
    },
    // 添加分类
    async addCate () {
      console.log(this.addForm)
      await addcategory(this.addForm)
      this.getcategoriesList()
      this.AddForm = false
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
  .table {
    margin-top: 20px;
  }
}
</style>
