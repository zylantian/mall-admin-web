<template> 
  <div class="app-container">
    <div class="table-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane name="first">
          <template slot="label">
            <p>调拨单申请详情</p>
          </template>
          <el-table ref="orderTable"
                    :data="list"
                    style="width: 100%;"
                    :row-class-name="tableRowClassName"
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
            <el-table-column label="商品数量" prop="productNum">
              <!--<template slot-scope="scope">
                <el-input v-model="scope.row.productNum" v-bind:readonly="readonly" type="number" min="1"></el-input>
              </template>-->
            </el-table-column>
          </el-table>
          <el-form :inline="true" style="margin-top: 40px" :model="stockDto" size="small" label-width="140px">
            <el-row>
              <el-form-item label="单据编号：">
                <div >{{stockDto.documentSn}}</div>
                <!--<el-input v-model="stockDto.documentSn" v-bind:readonly="true" style="width: 300px"></el-input>-->
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="调拨类型：">
                <el-radio v-model="stockDto.type" v-bind:readonly="true" :label="1">调拨</el-radio>
                <el-radio v-model="stockDto.type" v-bind:readonly="true" :label="2">反调拨</el-radio>
                <el-radio v-model="stockDto.type" v-bind:readonly="true" :label="3">总仓入库</el-radio>
              </el-form-item>
            </el-row>
            <el-row v-if="stockDto.status == 6">
              <el-form-item label="拒绝原因：">
                <div >{{stockDto.failReason}}</div>
              </el-form-item>
            </el-row>
          </el-form>
          <el-row :gutter="10" v-if="(stockDto.status == 1 || stockDto.status == 2 || stockDto.status == 3) && (currentDept.id == stockDto.nextorDeptId)">
            <div style="margin-left: 64px;margin-top: 30px">
              <el-form>
                <el-form-item label="审批操作：">
                  <el-radio v-model="tempStatus"  :label="1">同意</el-radio>
                  <el-radio v-model="tempStatus"  :label="0">拒绝</el-radio>
                </el-form-item>
                <el-form-item label="拒绝原因：" v-if="tempStatus == 0">
                  <el-input v-model="stockDto.failReason"  style="width: 300px">同意</el-input>
                </el-form-item>
              </el-form>
              <el-button type="primary" @click="approval()">同意</el-button>
            </div>
          </el-row>
        </el-tab-pane>
        <el-tab-pane name="second" v-if="(stockDto.status == 4 || stockDto.status == 5 || stockDto.status == 8) && stockDto.type != 3">
          <template slot="label">
            <p>发货详情</p>
          </template>
          <el-table ref="orderTable"
                    :data="list"
                    style="width: 100%;"
                    :row-class-name="tableRowClassName"
                    border>
            <el-table-column label="物流公司"  prop="deliveryCompany" min-width="20%" align="center"></el-table-column>
            <el-table-column label="物流单号"  prop="deliverySn" min-width="20%"  align="center"></el-table-column>
            <el-table-column label="发件人手机号"  prop="deliveryPhone" min-width="15%"  align="center"></el-table-column>
            <el-table-column label="发货数量"  prop="deliveryNum" min-width="15%" align="center"></el-table-column>
            <el-table-column label="状态" align="center" min-width="10%">
              <template slot-scope="scope">{{scope.row.status | formatDeliveryStatus}}</template>
            </el-table-column>

            <el-table-column label="操作" min-width="20%" align="center">
              <template slot-scope="scope">
                <el-button  v-if="scope.row.status == 1 && currentDept.id === stockDto.startorDeptId"
                  size="mini"
                  @click="deliveryConfirm(scope.row)"
                >确认收货
                </el-button>
                <el-button
                            size="mini"
                            @click="readDetail(scope.row)"
                >查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
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
        order: {type: 1, documentSn: null},
        activeName: "first",
        tabIndex: null,
        stockDto: {itemList: [], deliveryItemDtoList: []},
        currentDept: {id: -1},
        tempStatus: 1
      }
    },
    created() {
      this.stockDto = JSON.parse(this.$route.query.stock)
      this.$nextTick(() => {
        this.getProductList()
        this.getOrderDetail(this.stockDto.id)
        getCurrentDept().then(res => {
          if (res.code == 200) {
            this.currentDept = res.data
          }
        })
      }, 500)
    },
    filters: {
      formatDeliveryStatus(value) {
        if (value === 1) {
          return '待收货';
        } else if (value === 2) {
          return '已收货';
        }
      }
    },
    methods: {
      tableRowClassName({row, rowIndex}) {
        //把每一行的索引放进row
        row.index = rowIndex;
      },
      deliveryConfirm(data) {
        deliveryConfirm(data).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '确认收货成功',
              type: 'success',
              duration: 1000
            });
            this.$router.push({path:'/stock/stockOrderList'})
          }
        })
      },
      getOrderDetail(id) {
        let this_ = this
        orderDetail(id).then(res => {
          if (res.code ==200) {
            this_.stockDto = res.data
            if (this_.activeName == 'first') {
              this_.list = this_.stockDto.itemList
            } else {
              this_.list = this_.stockDto.deliveryItemDtoList
            }
          }
        })
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
      },
      handleClick(tab, event) {
        let index = tab.index
        // 防止重复点相同的index
        if (this.tabIndex != index) {
          if (this.activeName == 'first') {
            this.list = this.stockDto.itemList
          } else {
            this.list = this.stockDto.deliveryItemDtoList
          }
          //this.init()
          this.tabIndex = index
        }
      },
      approval() {
         if (this.tempStatus == 0) {
           if (this.stockDto.failReason == undefined || this.stockDto.failReason == null) {
             this.$message({
               message: '审批类型为拒绝时，原因必填！',
               type: 'warning',
               duration: 1000
             });
             return false;
           }
         }
         let data = {
           stockOrderId: this.stockDto.id,
           status: this.tempStatus,
           reason: this.stockDto.failReason
         }
        approval(data).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '操作成功！',
              type: 'success',
              duration: 1000
            });
          } else {
            this.$message({
              message: res.message,
              type: 'warning',
              duration: 1000
            });
          }
          this.$router.push({path:'/stock/stockOrderList'})
        })
      },
      readDetail(data) {
        this.$router.push({path:'/stock/deliveryDetail', query:{deliveryDto: JSON.stringify(data)}})
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 443px;
  }

  .table-container /deep/ .el-tabs__item {
    height: 60px;
  }
</style>


