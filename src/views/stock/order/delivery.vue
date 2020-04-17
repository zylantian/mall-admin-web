<template> 
  <div class="app-container">

    <div class="table-container">
      <el-table ref="orderTable"
                :data="list"
                style="width: 100%;"
                :row-class-name="tableRowClassName"
                border>

        <el-table-column label="商品" min-width="50%" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.productId" class="input-width" placeholder="全部" clearable>
              <el-option v-for="item in productList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="商品数量" min-width="35%">
          <template slot-scope="scope">
            <el-input v-model="scope.row.productNum" type="number" min="1" > </el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="15%" align="center">
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
      <el-form :inline="true" style="margin-top: 40px" :model="order"  size="small" label-width="140px">
        <el-row>
          <el-form-item label="物流公司：" :required="true">
            <el-select placeholder="请选择物流公司"
                       v-model="order.deliveryCompany"
                       size="small">
              <el-option v-for="item in companyOptions"
                         :key="item"
                         :label="item"
                         :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="物流单号：" :required="true">
            <el-input v-model="order.deliverySn"  style="width: 215px" ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="发货人手机号码：" :required="true">
            <el-input v-model="order.deliveryPhone"  style="width: 215px" ></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <el-row :gutter="10">
        <div style="margin-left: 144px;margin-top: 100px">
          <el-button type="primary" @click="saveOrder()">确认</el-button>
        </div>
      </el-row>
    </div>
  </div>
</template>
<script>
  import {delivery, fetchProductList} from '@/api/stock'
  const defaultLogisticsCompanies=["顺丰快递","圆通快递","中通快递","韵达快递"];

  export default {
    name: "addDeliveryOrder",
    data() {
      return {
        list: [{productId: null, productNum: 1}],
        productList: [],
        order: { deliveryCompany: null, deliverySn: null, deliveryPhone: null},
        companyOptions:defaultLogisticsCompanies,
        stockDto: {}
      }
    },
    created() {
      this.stockDto = JSON.parse(this.$route.query.stock)
      this.$nextTick(() => {
        fetchProductList(this.stockDto.id).then(res => {
          if (res.code == 200) {
            this.productList = res.data
          }
        })
      })
    },
    methods: {
      add() {
        this.list.push({
          productName: null, productNum: 1
        })
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
        this.list.forEach(temp => {
          if (temp.productId == null || temp.productId == undefined) {
            inputError = true
            this.$message({
              message: '必须选择商品！',
              type: 'warning',
              duration: 800
            })
            return false
          }

          if (temp.productNum == null || temp.productNum == undefined) {
            inputError = true
            this.$message({
              message: '必须输入商品数量且不能小于1 ',
              type: 'warning',
              duration: 800
            })
            return false
          }
        })
        if (inputError) {
          this.$message({
            message: '商品选择有误或者数量输入有误 ',
            type: 'warning',
            duration: 800
          })
          return false
        }
        if (this.order.deliveryCompany == null) {
          this.$message({
            message: '必须选择物流公司',
            type: 'warning',
            duration: 800
          })
          return false;
        }
        if (this.order.deliverySn == null) {
          this.$message({
            message: '必须输入物流单号',
            type: 'warning',
            duration: 800
          })
          return false;
        }
        if (this.order.deliveryPhone == null) {
          this.$message({
            message: '必须输入发货人手机号码',
            type: 'warning',
            duration: 800
          })
          return false;
        }
        let data = Object.assign({}, this.order)
        data.deliveryProductList = this.list
        delete data.deliveryProductList.index

        data.stockOrderId = this.stockDto.id
        delivery(data).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '新增发货单成功',
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
          this.$router.push({path:'/stock/stockOrderList'})
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


