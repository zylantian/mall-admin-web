<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
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
          <el-form-item label="发票状态：">
            <el-select v-model="listQuery.status" class="input-width" placeholder="全部" clearable>
              <el-option v-for="item in statusOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发票类型：">
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
        <el-table-column label="发票类型" :show-overflow-tooltip="true" min-width="12%" align="center">
          <template slot-scope="scope">{{scope.row| formatType}}</template>
        </el-table-column>
        <el-table-column label="提交时间" :show-overflow-tooltip="true" min-width="18%" align="center">
          <template slot-scope="scope">{{scope.row.createdAt | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column label="发票金额" min-width="15%"  :show-overflow-tooltip="true"  prop="orderMoney" align="center"></el-table-column>
        <el-table-column label="申请人/企业" min-width="21%" align="center">
          <template slot-scope="scope">{{scope.row | formatName}}</template>
        </el-table-column>
        <el-table-column label="状态" min-width="12%" align="center">
          <template slot-scope="scope">{{scope.row.status | formatStatus}}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="20%" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleViewOrder(scope.$index, scope.row)"
            >查看详情</el-button>
            <el-button
              size="mini"
              @click="handleViewOrder(scope.$index, scope.row)"
              v-if="scope.row.status === 3">审核</el-button>
            <el-button
              size="mini"
              @click="handleViewOrder(scope.$index, scope.row)"
              v-if="scope.row.status === 5">邮寄发票</el-button>
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
  import {fetchList} from '@/api/bill'
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
    name: "billList",
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        listLoading: true,
        list: null,
        total: null,
        statusOptions: [
          {
            label: '已完成',
            value: 1
          },
          {
            label: '待提交合同照片',
            value: 2
          },
          {
            label: '待财务审核',
            value: 3
          },
          {
            label: '待合同邮寄',
            value: 4
          },
          {
            label: '待发票邮寄',
            value: 5
          },
          {
            label: '待确认收到发票',
            value: 6
          },
          {
            label: '已拒绝',
            value: 7
          }
        ],
        typeOptions: [
          {
            label: '普票发票',
            value: 1
          },
          {
            label: '增值税专用票',
            value: 2
          }
        ],
        currentDept: {}
      }
    },
    created() {
      this.$nextTick(() => {
        this.getList();
      }, 500)
    },
    filters: {
      formatCreateTime(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      formatType(value) {
        if (value.type == 1) {
          if (value.redApply) {
            return '普票发票(换开)'
          } else {
            return '普票发票'
          }

        }

        if (value.type == 2) {
          if (value.redApply) {
            return '增值税专用票(换开)'
          } else {
            return '增值税专用票'
          }
        }
      },
      formatName(row) {
        if (row.subType != null && row.subType != undefined && row.subType == 1) {
          return row.personalName
        } else {
          return row.enterName
        }
      },
      formatStatus(value) {
        if (value === 1) {
          return '已完成';
        } else if (value === 2) {
          return '待提交合同照片';
        } else if (value === 3) {
          return '待财务审核';
        } else if (value === 4) {
          return '待合同邮寄';
        } else if (value === 5) {
          return '待发票邮寄';
        } else if (value === 6) {
          return '待确认收到发票';
        } else {
          return '已拒绝'
        }
      },
    },
    methods: {
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleViewOrder(index, row){
        this.$router.push({path:'/oms/billDetail', query: {bill: JSON.stringify(row)}})
      },
      handleDeliveryOrder(index, row){
        this.$router.push({path:'/oms/addBillDelivery',query:{bill: JSON.stringify(row)}})
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
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>


