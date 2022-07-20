<template>
  <div>
    <!-- 头部 -->
    <div class="header">
      <Breadcrumb list="商品列表" manage="商品管理"></Breadcrumb>
    </div>
    <!-- 主体 -->
    <!-- 搜索框 -->
    <div class="main">
      <template>
        <el-row :gutter="20" type="flex">
          <el-col :span="8">
            <el-input
              placeholder="请输入内容"
              v-model="findId"
              clearable
              @clear="getGoodList()"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getGoodsById"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="$router.push('/home/add')"
              >添加商品</el-button
            >
          </el-col>
        </el-row>
      </template>
      <!-- 商品表格数据 -->
      <template>
        <el-table :data="tableData" border="">
          <el-table-column type="index" label="#" min-width="50px">
          </el-table-column>
          <el-table-column prop="goods_name" label="商品名称" min-width="600px">
          </el-table-column>
          <el-table-column
            prop="goods_price"
            label="商品价格(元)"
            min-width="80px"
          >
          </el-table-column>
          <el-table-column
            prop="goods_weight"
            label="商品重量"
            min-width="80px"
          >
          </el-table-column>
          <el-table-column label="创建时间" width="120px">
            <template slot-scope="scope">
              {{ (scope.row.add_time * 1000) | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="190px">
            <template v-slot="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editgoods(scope.row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delopen(scope.row.goods_id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <template>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="goods.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="goods.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </template>
        <!-- 修改商品弹出框 -->
        <el-dialog
          title="修改用户对话框"
          :visible.sync="emitDialog"
          ref="editform"
        >
          <el-form :model="goodList" :rules="rules">
            <el-form-item label="商品id" label-width="80px" prop="id">
              <el-input v-model="goodList.id" disabled> </el-input>
            </el-form-item>
            <el-form-item label="商品名称" label-width="80px" prop="goods_name">
              <el-input v-model="goodList.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="价格" label-width="80px" prop="goods_price">
              <el-input v-model="goodList.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="数量" label-width="80px" prop="goods_number">
              <el-input v-model="goodList.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="重量" label-width="80px" prop="goods_weight">
              <el-input v-model="goodList.goods_weight"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="emitDialog = false">取 消</el-button>
            <el-button type="primary" @click="editchange">确 定</el-button>
          </div>
        </el-dialog>
      </template>
    </div>
  </div>
</template>

<script>
import { getGoodList, editGoods, DelGoods, getGoodsById } from '@/api/goods'
export default {
  created () { this.getGoodList() },
  data () {
    return {
      tableData: [],
      goods: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      goodList: {},
      emitDialog: false,
      rules: {
        goods_name: [
          { required: true, message: '商品名不能为空', trigger: 'blur' },
          {
            min: 3, max: 8, message: '商品名长度在3到8之间', trigger: 'blur'
          }
        ],
        goods_price: [
          { required: true, message: '商品价格不能为空', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '商品数量不能为空', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '商品重量不能为空', trigger: 'blur' }
        ]
      },
      findId: ''
    }
  },
  methods: {
    // 获得商品列表
    async getGoodList () {
      const res = await getGoodList(this.goods)
      console.log(res)
      this.total = res.data.data.total
      this.tableData = res.data.data.goods
    },
    // 根据条数刷新数据
    handleSizeChange (val) {
      this.goods.pagesize = val
      this.getGoodList()
    },
    // 根据页码刷新数据
    handleCurrentChange (val) {
      this.goods.pagenum = val
      this.getGoodList()
    },
    // 修改商品
    editgoods (obj) {
      this.emitDialog = true
      console.log(obj)
      // this.goodList.id = obj.goods_id
      // this.goodList.goods_name = obj.goods_name
      // this.goodList.goods_price = obj.goods_price
      // this.goodList.goods_number = obj.goods_number
      // this.goodList.goods_weight = obj.goods_weight
      this.goodList = { ...obj }
      this.goodList.id = obj.goods_id
    },
    async editchange () {
      const res = await editGoods(this.goodList)
      if (res.data.meta.status === 201) {
        this.$message.success(res.data.meta.msg)
        this.emitDialog = false
      } else {
        this.$message.error(res.data.meta.msg)
      }
    },
    delopen (id) {
      console.log(id)
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await DelGoods(id)
        this.getGoodList()
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
    // 利用角色id获得角色
    async getGoodsById () {
      const res = await getGoodsById({ id: this.findId })
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
}
</style>
