<template>
  <div class="app-container">
    <div class="total-layout">
      <el-row :gutter="20">
        <el-col :span="statisticsData.isSales ? 12 : 6">
          <div class="total-frame">
            <img :src="img_home_order" class="total-icon">
            <div class="total-title">订单总数</div>
            <div class="total-value">{{statisticsData.orderAmount}}</div>
          </div>
        </el-col>
        <el-col :span="statisticsData.isSales ? 12 : 6">
          <div class="total-frame">
            <img :src="img_home_today_amount" class="total-icon">
            <div class="total-title">销售总额</div>
            <div class="total-value">{{statisticsData.orderMoneyAmount}}</div>
          </div>
        </el-col>
        <el-col :span="6" v-if="!statisticsData.isSales">
          <div class="total-frame">
            <img :src="sales_amount" class="total-icon">
            <div class="total-title">商户总数</div>
            <div class="total-value">{{statisticsData.salesAmount}}</div>
          </div>
        </el-col>
        <el-col :span="6" v-if="!statisticsData.isSales">
          <div class="total-frame">
            <img :src="enterprise_amount" class="total-icon">
            <div class="total-title">企业总数</div>
            <div class="total-value">{{statisticsData.enterAmount}}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="un-handle-layout">
      <div class="layout-title">待处理事务</div>
      <div class="un-handle-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待付款订单</span>
              <span style="float: right" class="color-danger">({{statisticsData.waitPayAmount}})</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">已完成订单</span>
              <span style="float: right" class="color-danger">({{statisticsData.finishedAmount}})</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待确认收货订单</span>
              <span style="float: right" class="color-danger">({{statisticsData.sendedAmount}})</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待发货订单</span>
              <span style="float: right" class="color-danger">({{statisticsData.payedAmount}})</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待处理退货订单</span>
              <span style="float: right" class="color-danger">({{statisticsData.renturnAmount}})</span>
            </div>
          </el-col>
        </el-row>
      </div>
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
  import {fetchList} from '@/api/home'
  export default {
    name: 'home',
    data() {
      return {
        //orderCountDate: '',
        loading: false,
        dataEmpty: false,
        img_home_order,
        img_home_today_amount,
        img_home_yesterday_amount,
        sales_amount,
        enterprise_amount,
        statisticsData: {

        }
      }
    },
    created(){
      //this.initOrderCountDate();
      this.getData();
    },
    methods:{
      initOrderCountDate(){
       /* let start = new Date();
        /!*start.setFullYear(2018);
        start.setMonth(10);
        start.setDate(1);*!/
        const end = new Date();
        end.setTime(start.getTime() + 1000 * 60 * 60 * 24 * 7);
        this.orderCountDate=[start,end];*/
      },
      getData(){
        /*setTimeout(() => {

        }, 1000)*/
        fetchList().then((res) => {
          this.statisticsData = res.data
        })
        this.dataEmpty = false;
        this.loading = false
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

  .address-layout {
  }

  .total-layout {
    margin-top: 20px;
  }

  .total-frame {
    border: 1px solid #DCDFE6;
    padding: 20px;
    height: 100px;
  }

  .total-icon {
    color: #409EFF;
    width: 60px;
    height: 60px;
  }

  .total-title {
    position: relative;
    font-size: 16px;
    color: #909399;
    left: 70px;
    top: -50px;
  }

  .total-value {
    position: relative;
    font-size: 18px;
    color: #606266;
    left: 70px;
    top: -40px;
  }

  .un-handle-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }

  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }

  .un-handle-content {
    padding: 20px 40px;
  }

  .un-handle-item {
    border-bottom: 1px solid #EBEEF5;
    padding: 10px;
  }

  .overview-layout {
    margin-top: 20px;
  }

  .overview-item-value {
    font-size: 24px;
    text-align: center;
  }

  .overview-item-title {
    margin-top: 10px;
    text-align: center;
  }

  .out-border {
    border: 1px solid #DCDFE6;
  }

  .statistics-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }
  .mine-layout {
    position: absolute;
    right: 140px;
    top: 107px;
    width: 250px;
    height: 235px;
  }
  .address-content{
    padding: 20px;
    font-size: 18px
  }
</style>
