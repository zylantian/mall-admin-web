<template> 
  <el-dialog title="订单跟踪"
             :visible.sync="visible"
             :before-close="handleClose"
             width="40%">
    <el-steps direction="vertical"
              :active="6"
              finish-status="success"
              space="50px">
      <el-step  v-for="item in logisticsList"
                :key="item.status"
                :title="item.status"
                :description="item.time"></el-step>
    </el-steps>
  </el-dialog>
</template>
<script>
  import {viewLogistics} from '@/api/order';
  const defaultLogisticsList=[
    {status: '订单已提交，等待付款',time:'2017-04-01 12:00:00 '},
    {status: '订单付款成功',time:'2017-04-01 12:00:00 '},
    {status: '在北京市进行下级地点扫描，等待付款',time:'2017-04-01 12:00:00 '},
    {status: '在分拨中心广东深圳公司进行卸车扫描，等待付款',time:'2017-04-01 12:00:00 '},
    {status: '在广东深圳公司进行发出扫描',time:'2017-04-01 12:00:00 '},
    {status: '到达目的地网点广东深圳公司，快件将很快进行派送',time:'2017-04-01 12:00:00 '},
    {status: '订单已签收，期待再次为您服务',time:'2017-04-01 12:00:00 '}
  ];
  export default {
    name:'logisticsDialog',
    props: {
      value: Boolean,
      deliverySn: ''
    },
    computed:{
      visible: {
        get() {
          return this.value;
        },
        set(visible){
          this.value = visible;
        }
      }
    },
    watch: {
      deliverySn : function(newValue) {
        if (newValue == null || newValue == '' || newValue == undefined) {
          return
        }
        this.initData()
      }
    },
    created () {
       this.initData()
    },
    data() {
      return {
        logisticsList: Object.assign({},defaultLogisticsList)
      }
    },
    methods:{
      initData() {
        if (this.deliverySn == null || this.deliverySn == '' || this.deliverySn == undefined) {
          return
        }
        let params = new URLSearchParams();
        params.append("orderId", [this.deliverySn]);
        viewLogistics(params).then(response=>{
          if (response.code == 200) {
            this.logisticsList = response.data.result.list
          } else {
            this.logisticsList = Object.assign({},defaultLogisticsList)
          }
        })
      },
      emitInput(val) {
        this.$emit('input', val)
      },
      handleClose(){
        this.emitInput(false);
      }
    }
  }
</script>
<style></style>


