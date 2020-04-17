<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button v-if="currentDept.type == 2 || currentDept.type == 3"
          style="float:right"
          type="primary"
          @click="transform()"
          size="small">
          新增调拨单
        </el-button>
        <el-button v-if="currentDept.type == 4"
                   style="float:right"
                   type="primary"
                   @click="insertStock()"
                   size="small">
          新增入库单
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="提交时间：">
            <!--<el-date-picker
              class="input-width"
              v-model="listQuery.createdAt"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择时间">
            </el-date-picker>-->
            <el-date-picker
              v-model="listQuery.createdAt"
              type="daterange"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="~"
              start-placeholder="开始时间"
              end-placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="调拨单状态：">
            <el-select v-model="listQuery.status" class="input-width" placeholder="全部" clearable>
              <el-option v-for="item in statusOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="调拨类型：">
            <el-select v-model="listQuery.type" class="input-width" placeholder="全部" clearable>
              <el-option v-for="item in typeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" border>
        <!--<el-table-column  min-width="3%" align="center"></el-table-column>
        <el-table-column label="编号" min-width="5%" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>-->
        <el-table-column label="单据编号" :show-overflow-tooltip="true" min-width="12%" align="center">
          <template slot-scope="scope">{{scope.row.documentSn}}</template>
        </el-table-column>
        <el-table-column label="提交时间" :show-overflow-tooltip="true" min-width="10%" align="center">
          <template slot-scope="scope">{{scope.row.createdAt | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column label="源仓库" min-width="15%"  :show-overflow-tooltip="true"  prop="srcWarehouseName" align="center"></el-table-column>
        <el-table-column label="目的仓库" min-width="15%" :show-overflow-tooltip="true"  prop="destWarehouseName" align="center"></el-table-column>
        <el-table-column label="调拨类型" min-width="8%" align="center">
          <template slot-scope="scope">{{scope.row.type | formatType}}</template>
        </el-table-column>
        <el-table-column label="商品种类数量" min-width="8%"  align="center">
          <template slot-scope="scope">{{scope.row.productTypeNum}}</template>
        </el-table-column>
        <el-table-column label="商品数量" min-width="10%" align="center">
          <template slot-scope="scope">{{scope.row.productNum}}</template>
        </el-table-column>
        <el-table-column label="状态" min-width="8%" align="center">
          <template slot-scope="scope">{{scope.row.status | formatStatus}}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="14%" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleViewOrder(scope.$index, scope.row)"
            >查看调拨单</el-button>
            <el-button
              size="mini"
              @click="handleDeliveryOrder(scope.$index, scope.row)"
              v-if="scope.row.status === 4 && currentDept.id === scope.row.nextorDeptId">发货</el-button>
            <!--<el-button
              size="mini"
              @click="confirmLoanOrder(scope.$index, scope.row)"
              v-show="scope.row.status === 1 || scope.row.status === 2 || scope.row.status === 3">审核</el-button>-->
            <el-button
              size="mini"
              type="danger"
              @click="cancelOrder(scope.row)"
              v-show="scope.row.status === 1">取消订单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {fetchList, cancelOrder} from '@/api/stock'
  import {getCurrentDept} from '@/api/system/dept'
  import {formatDate} from '@/utils/date';
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    status: null,
    createdAt: null,
    sort: 'createdAt,desc',
    type: null
  };
  export default {
    name: "stockOrderList",
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        listLoading: true,
        list: null,
        total: null,
        statusOptions: [
          {
            label: '待分仓经理审核',
            value: 1
          },
          {
            label: '待财务经理审核',
            value: 2
          },
          {
            label: '待生产部经理审核',
            value: 3
          },
          {
            label: '待发货',
            value: 4
          },
          {
            label: '已完成',
            value: 5
          },
          {
            label: '已拒绝',
            value: 6
          },
          {
            label: '已取消',
            value: 7
          },
          {
            label: '待确认收货',
            value: 8
          }
        ],
        typeOptions: [
          {
            label: '调拨',
            value: 1
          },
          {
            label: '反调拨',
            value: 2
          },
          {
            label: '总仓入库',
            value: 3
          }
        ],
        currentDept: {}
      }
    },
    created() {
      this.$nextTick(() => {
        getCurrentDept().then(res => {
          if (res.code == 200) {
            this.currentDept = res.data
          }
        })
        this.getList();
      }, 500)
    },
    filters: {
      formatCreateTime(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      formatType(value) {
        if (value == 1) return '调拨'
        if (value == 2) return '反调拨'
        if (value == 3) return '总仓入库'
      },
      formatStatus(value) {
        if (value === 1) {
          return '待分仓经理审核';
        } else if (value === 2) {
          return '待财务经理审核';
        } else if (value === 3) {
          return '待生产部经理审核';
        } else if (value === 4) {
          return '待发货';
        } else if (value === 5) {
          return '已完成';
        } else if (value === 7) {
          return '已取消';
        } else if (value === 8) {
          return '待确认收货';
        } else {
          return '已拒绝';
        }
      },
    },
    methods: {
      transform() {
        this.$router.push({path:'/stock/addStockOrder'})
      },
      insertStock() {
        this.$router.push({path:'/stock/insertStockOrder'})
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleViewOrder(index, row){
        this.$router.push({path:'/stock/stockOrderDetail', query: {stock: JSON.stringify(row)}})
      },
      handleDeliveryOrder(index, row){
        this.$router.push({path:'/stock/addDelivery',query:{stock: JSON.stringify(row)}})
      },
      handleSizeChange(val){
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val){
        this.listQuery.pageNum = val;
        this.getList();
      },
      getList() {
        this.listLoading = true;
        let queryParam = Object.assign({}, this.listQuery)
        if (this.listQuery.createdAt != null && this.listQuery.createdAt != undefined) {
          queryParam.startDate = this.listQuery.createdAt[0]
          queryParam.endDate = this.listQuery.createdAt[1]
          delete queryParam.createdAt
        }
        fetchList(queryParam).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      cancelOrder(id){
        this.$confirm('是否要进行该取消操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          cancelOrder(id).then(response=>{
            this.$message({
              message: '取消成功！',
              type: 'success',
              duration: 1000
            });
            this.getList();
          });
        })
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>


