<template> 
  <div class="app-container">
    <div style="color: red" v-if="productEmpty">系统初始时，请从商品列表中编辑商品，这样才能把平台商品库的商品导入到自己库中,然后才能发起调拨</div>
    <div class="table-container">
      <el-table ref="orderTable"
                :data="list"
                style="width: 100%;"
                :row-class-name="tableRowClassName"
                border>

        <el-table-column label="商品" min-width="40%" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.product" value-key="id" class="input-width" placeholder="全部" clearable>
              <el-option v-for="item in productList"
                         :key="item.id"
                         :label="item.name"
                         :value="item">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="入库价格" min-width="15%">
          <template slot-scope="scope">
            <span>{{scope.row.product.price}}</span>
           <!-- <el-input v-model="scope.row.product.price" type="number" min="1" > </el-input>-->
          </template>
        </el-table-column>
        <el-table-column label="区域价格" min-width="25%">
          <template slot-scope="scope">
            <el-input v-model="scope.row.destPrice" type="number" min="1" > </el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="25%" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="add()"
            >继续添加</el-button>
            <el-button
              size="mini"
              @click="del(scope.row.index)"
              type="danger"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form :inline="true" style="margin-top: 40px" size="small" label-width="50px">
        <el-row>
          <el-form-item label="区域" :required="true"></el-form-item>
        </el-row>
        <el-row>
          <el-select style="margin-left: 22px" v-model="tempRegionList" placeholder="全部" :multiple="true" clearable class="input-width">
            <el-option v-for="item in regionList"
                       :key="item.geoId"
                       :label="item.geoName"
                       :value="item.geoId">
            </el-option>
          </el-select>
        </el-row>
      </el-form>
      <el-row :gutter="10">
        <div style="margin-left: 486px;margin-top: 100px">
          <el-button type="primary" @click="saveOrder()">确认</el-button>
        </div>
      </el-row>
    </div>
  </div>
</template>
<script>
  import {fetchSelfList} from '@/api/product'
  import {addOrder} from '@/api/stock'
  import {getSelfRegion} from '@/api/system/deptRegion'
  import {add} from '@/api/productRegion'
  export default {
    name: "addProductRegion",
    data() {
      return {
        list: [{product: {price: null}, destPrice: null}],
        productList: [],
        productEmpty: false,
        regionList: [],
        tempRegionList: []
      }
    },
    created() {
      this.$nextTick(() => {
        let param = {
          publishStatus: 1,
          pageSize: 100,
          pageNum: 0
        }
        fetchSelfList(param).then(res => {
          if (res.code == 200) {
            if (res.data.list.length == 0) {
              this.productEmpty = true
              this.$message({
                message: '请从商品列表中导入商品到自己的库中！',
                type: 'warning',
                duration: 800
              })
            } else {
              this.productList = res.data.list
            }
          }
        })
        getSelfRegion().then(res => {
          if (res.code == 200) {
            this.regionList = res.data
          }
        })
      })
    },
    methods: {
      add() {
        this.list.push({product: {price: null}, destPrice: null})
      },
      del(index) {
        this.list.splice(index, 1)
      },
      tableRowClassName ({row, rowIndex}) {
          //把每一行的索引放进row
         row.index = rowIndex;
      },
      saveOrder() {
        if (this.list == null || this.list == undefined || this.list.length == 0) {
          this.$message({
            message: '必须选择商品！',
            type: 'warning',
            duration: 800
          })
          return false
        }
        let inputError = false
        let productList = []
        this.list.forEach(temp => {
          if (temp.product.id == null || temp.product.id == undefined) {
            inputError = true
            this.$message({
              message: '必须选择商品！',
              type: 'warning',
              duration: 800
            })
            return false
          }

          if (temp.destPrice == null || temp.destPrice == undefined) {
            inputError = true
            this.$message({
              message: '区域价格必须输入',
              type: 'warning',
              duration: 800
            })
            return false
          }
          productList.push({
            productId: temp.product.id,
            originPrice: temp.product.price,
            destPrice: temp.destPrice
          })
        })
        if (inputError) {
          this.$message({
            message: '商品选择有误或者区域价格没有输入',
            type: 'warning',
            duration: 800
          })
          return false
        }
        let data = {
          productList: productList,
          regionIdList: this.tempRegionList
        }
        add(data).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '新增区域价格成功',
              type: 'success',
              duration: 800
            })
          } else {
            this.$message({
              message: res.message,
              type: 'warning',
              duration: 800
            })
          }
          this.$router.push({path:'/pms/regionList'})
        })
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 383px;
  }
</style>


