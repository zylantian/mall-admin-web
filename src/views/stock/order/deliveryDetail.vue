<template> 
  <div class="app-container">
    <div class="table-container">
      <el-table ref="orderTable"
                    :data="list"
                    style="width: 100%;"
                    border>

            <el-table-column label="商品名称"  align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.productId" :disabled="true" class="input-width" placeholder="全部" clearable>
                  <el-option v-for="item in productList"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="商品数量">
              <template slot-scope="scope">
                <el-input v-model="scope.row.productNum" :disabled="true" type="number" min="1"></el-input>
              </template>
            </el-table-column>
          </el-table>
          <el-form :inline="true" style="margin-top: 40px" :model="deliveryDto" size="small" label-width="140px">
            <el-row>
              <el-form-item label="物流公司：">
                <el-input v-model="deliveryDto.deliveryCompany" :disabled="true" style="width: 300px"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="物流单号：">
                <el-input v-model="deliveryDto.deliverySn" :disabled="true" style="width: 300px"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="发件人手机号：">
                <el-input v-model="deliveryDto.deliveryPhone" :disabled="true" style="width: 300px"></el-input>
              </el-form-item>
            </el-row>
            <el-row >
              <el-form-item label="状态：">
                <el-input v-model="formatDeliveryStatus(deliveryDto.status)" style="width: 300px"></el-input>
              </el-form-item>
            </el-row>
          </el-form>
    </div>
  </div>
</template>
<script>
  import {fetchList} from '@/api/product'
  import {orderDetail, approval, deliveryConfirm} from '@/api/stock'
  import {getCurrentDept} from '@/api/system/dept'


  export default {
    name: "stockDetail",
    data() {
      return {
        list: [],
        productList: [],
        deliveryDto: {}
      }
    },
    created() {
      this.deliveryDto = JSON.parse(this.$route.query.deliveryDto)
      this.list = this.deliveryDto.deliveryProductList
      this.$nextTick(() => {
        this.getProductList()
      }, 500)
    },
    methods: {
      formatDeliveryStatus(value) {
        if (value === 1) {
          return '待收货';
        } else if (value === 2) {
          return '已收货';
        }
      },
      getProductList() {
        let param = {
          publishStatus: 1,
          pageSize: 100,
          pageNum: 0
        }
        fetchList(param).then(res => {
          if (res.code == 200) {
            this.productList = res.data.list
          }
        })
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 443px;
  }
</style>


