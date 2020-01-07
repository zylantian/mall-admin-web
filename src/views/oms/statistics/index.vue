<template>
  <div class="app-container">
    <div class="statistics-layout">
      <div class="layout-title">订单统计</div>
      <el-row :gutter="20">
        <!--<el-col :span="4">
          <div style="padding: 20px">
            <div>
              <div style="color: #909399;font-size: 14px">本月订单总数</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">10000</div>
              <div>
                <span class="color-success" style="font-size: 14px">+10%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上月</span>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">本周订单总数</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">1000</div>
              <div>
                <span class="color-danger" style="font-size: 14px">-10%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上周</span>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">本月销售总额</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">100000</div>
              <div>
                <span class="color-success" style="font-size: 14px">+10%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上月</span>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">本周销售总额</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">50000</div>
              <div>
                <span class="color-danger" style="font-size: 14px">-10%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上周</span>
              </div>
            </div>
          </div>
        </el-col>-->
        <el-col :span="24">
          <div style="padding: 10px;border: 1px solid #DCDFE6;">
            <el-date-picker
              style="float: right;z-index: 1"
              size="small"
              v-model="orderCountDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleDateChange"
              :picker-options="pickerOptions">
            </el-date-picker>
            <div>
              <ve-line
                :data="chartData"
                :legend-visible="true"
                :loading="loading"
                :data-empty="dataEmpty"
                :settings="chartSettings"></ve-line>
            </div>
          </div>
        </el-col>
      </el-row>
      <div v-if="!isSales" class="layout-title">订单数量</div>
      <el-row v-if="!isSales"  :gutter="20">
        <el-col :span="12">
          <div style="padding: 10px;border: 1px solid #DCDFE6;">
            <div>
              <ve-pie
                :data="pieCompanyCountData"
                :legend-visible="true"
                :loading="loading"
                :data-empty="dataEmpty"
                :settings="pieFirstSettings"
                :events="pieEvents">
              </ve-pie>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="padding: 10px;border: 1px solid #DCDFE6;">
            <div>
              <ve-pie
                :data="pieSalesCountData"
                :legend-visible="true"
                :loading="loading"
                :data-empty="dataEmpty"
                :settings="chartSettings"></ve-pie>
            </div>
          </div>
        </el-col>
      </el-row>
      <div v-if="!isSales" class="layout-title">订单金额</div>
      <el-row v-if="!isSales" :gutter="20">
        <el-col :span="12">
          <div style="padding: 10px;border: 1px solid #DCDFE6;">
            <div>
              <ve-pie
                :data="pieCompanyAmountData"
                :legend-visible="true"
                :loading="loading"
                :data-empty="dataEmpty"
                :settings="pieFirstSettings"
                :events="pieAmountEvents"></ve-pie>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="padding: 10px;border: 1px solid #DCDFE6;">
            <div>
              <ve-pie
                :data="pieSalesAmountData"
                :legend-visible="true"
                :loading="loading"
                :data-empty="dataEmpty"
                :settings="chartSettings"></ve-pie>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import {str2Date} from '@/utils/date';
  import img_home_order from '@/assets/images/home_order.png';
  import img_home_today_amount from '@/assets/images/home_today_amount.png';
  import img_home_yesterday_amount from '@/assets/images/home_yesterday_amount.png';
  import sales_amount from '@/assets/images/sales_amount.png';
  import enterprise_amount from '@/assets/images/enterprise_amount.png';
  import {statisticsQuery} from '@/api/home'

  const DATA_FROM_BACKEND = {
    columns: ['date', 'orderCount', 'orderAmount'],
    rows: []
  };
  export default {
    name: 'home',
    data() {
      var self = this;
      return {
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              let start = new Date();
              start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一月',
            onClick(picker) {
              const end = new Date();
              var year = end.getFullYear(); //获取当前日期的年份
              var month = end.getMonth() + 1; //获取当前日期的月份
              var day = end.getDate(); //获取当前日期的日
              var year2 = year;
              var month2 = parseInt(month) - 1;
              if (month2 <= 0) {
                year2 = parseInt(year2) - 1;
                month2 = 12 - (Math.abs(month2) % 12) - 1;
              }
              if (month2 < 10) {
                month2 = '0' + month2;
              }
              let start = new Date(year2, month2, day)
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一季度',
            onClick(picker) {
              const end = new Date();
              var year = end.getFullYear(); //获取当前日期的年份
              var month = end.getMonth() + 1; //获取当前日期的月份
              var day = end.getDate(); //获取当前日期的日
              var year2 = year;
              var month2 = parseInt(month) - 3;
              if (month2 <= 0) {
                year2 = parseInt(year2) - 1;
                month2 = 12 - (Math.abs(month2) % 12) - 1;
              }
              if (month2 < 10) {
                month2 = '0' + month2;
              }
              let start = new Date(year2, month2, day)
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一年',
            onClick(picker) {
              const end = new Date();
              var year = end.getFullYear(); //获取当前日期的年份
              var month = end.getMonth() + 1; //获取当前日期的月份
              var day = end.getDate(); //获取当前日期的日
              var year2 = year;
              var month2 = parseInt(month) - 12;
              if (month2 <= 0) {
                year2 = parseInt(year2) - 1;
                month2 = 12 - (Math.abs(month2) % 12) - 1;
              }
              if (month2 < 10) {
                month2 = '0' + month2;
              }
              let start = new Date(year2, month2, day)
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        orderCountDate: '',
        chartSettings: {
          xAxisType: 'category',
          area: true,
          axisSite: {right: ['orderAmount']},
          labelMap: {'orderCount': '订单数量', 'orderAmount': '订单金额'}
        },
        pieFirstSettings: {
          selectedMode: 'single',
          hoverAnimation: false
        },
        chartData: {
          columns: ['date', 'orderCount', 'orderAmount'],
          rows: []
        },
        pieEvents: {
          click: function (e) {
            self.pieSalesCountData.rows = self.companyCountPieVos[e.dataIndex].sonStatisticsPieVoList
          }
        },
        pieAmountEvents: {
          click: function (e) {
            self.pieSalesAmountData.rows = self.companySumPieVos[e.dataIndex].sonStatisticsPieVoList
          }
        },
        pieCompanyCountData: {
          columns: ['name', 'value'],
          rows: []
        },
        pieSalesCountData: {
          columns: ['name', 'value'],
          rows: []
        },
        pieCompanyAmountData: {
          columns: ['name', 'value'],
          rows: []
        },
        pieSalesAmountData: {
          columns: ['name', 'value'],
          rows: []
        },
        loading: false,
        dataEmpty: false,
        img_home_order,
        img_home_today_amount,
        img_home_yesterday_amount,
        sales_amount,
        enterprise_amount,
        companyCountPieVos: [],
        companySumPieVos: [],
        isSales: false
      }
    },
    created() {
      this.initOrderCountDate();
      this.getData();
    },
    methods: {
      handleDateChange() {
        this.loading = true
        this.dataEmpty = true
        this.getData();
      },
      initOrderCountDate() {
        let start = new Date();
        const end = new Date();
        start.setTime(end.getTime() - 1000 * 60 * 60 * 24 * 7);
        this.orderCountDate = [start, end];
      },
      getData() {
        setTimeout(() => {
          let param = {
            timeStart: this.orderCountDate[0],
            timeEnd: this.orderCountDate[1]
          }
          statisticsQuery(param).then(res => {
            let lineVos = res.data.lineVos
            if (lineVos.length > 0) {
              this.chartData.rows = lineVos
            }
            this.companyCountPieVos = res.data.companyCountPieVos
            this.companySumPieVos = res.data.companySumPieVos
            if (this.companyCountPieVos.length > 0) {
              this.pieCompanyCountData.rows = this.companyCountPieVos
              this.pieSalesCountData.rows = this.companyCountPieVos[0].sonStatisticsPieVoList
            }
            if (this.companySumPieVos.length > 0) {
              this.pieCompanyAmountData.rows = this.companySumPieVos
              this.pieSalesAmountData.rows = this.companyCountPieVos[0].sonStatisticsPieVoList
            }
            this.isSales = res.data.isSales
          })
          this.dataEmpty = false;
          this.loading = false
        }, 1000)
      }
    }
  }
</script>

<style scoped>
  .app-container {
    margin-top: 40px;
    margin-left: 120px;
    margin-right: 120px;
  }

  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }
  .statistics-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }

</style>
