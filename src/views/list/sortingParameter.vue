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
              ><el-button type="primary" size="mini"
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
                    <el-button type="danger" icon="el-icon-delete" size="mini"
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
                    <el-button type="danger" icon="el-icon-delete" size="mini"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
  </div>
</template>

<script>
import { getcategoriesList, getCateAttributes } from '@/api/category'
export default {
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
      onlyData: []
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
    handleTabClick () {
      console.log(this.activeName)
      this.getTableData()
    },
    fn (obj) {
      console.log(obj)
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
