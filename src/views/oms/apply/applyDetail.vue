<template>
  <div class="detail-container">
    <!--<el-card shadow="never">
      <span class="font-title-medium">退货商品</span>
      <el-table
        border
        class="standard-margin"
        ref="productTable"
        :data="productList">
        <el-table-column label="商品图片" width="160" align="center">
          <template slot-scope="scope">
            <img style="height:80px" :src="scope.row.productPic">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <span class="font-small">{{scope.row.productName}}</span><br>
            <span class="font-small">品牌：{{scope.row.productBrand}}</span>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="180" align="center">
          <template slot-scope="scope">
            <span class="font-small">价格：￥{{scope.row.productRealPrice}}</span><br>
            <span class="font-small">货号：NO.{{scope.row.productId}}</span>
          </template>
        </el-table-column>
        <el-table-column label="属性" width="180" align="center">
          <template slot-scope="scope">{{scope.row.productAttr}}</template>
        </el-table-column>
        <el-table-column label="数量" width="100" align="center">
          <template slot-scope="scope">{{scope.row.productCount}}</template>
        </el-table-column>
        <el-table-column label="小计" width="100" align="center">
          <template slot-scope="scope">￥{{totalAmount}}</template>
        </el-table-column>
      </el-table>
      <div style="float:right;margin-top:15px;margin-bottom:15px">
        <span class="font-title-medium">合计：</span>
        <span class="font-title-medium color-danger">￥{{totalAmount}}</span>
      </div>
    </el-card>-->
    <el-card shadow="never" class="standard-margin">
      <span class="font-title-medium">服务单信息</span>
      <div class="form-container-border">
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">服务单号</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.id}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">申请状态</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.status | formatStatus}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small" style="height:50px;line-height:30px">订单编号
          </el-col>
          <el-col class="form-border font-small" :span="18" style="height:50px">
            {{orderReturnApply.orderSn}}
            <el-button type="text" size="small" @click="handleViewOrder">查看</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">申请时间</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.createTime | formatTime}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">用户账号</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.memberUsername}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">联系人</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.returnName}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">联系电话</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.returnPhone}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">换货原因</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.reason}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">问题描述</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.description}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6" style="height:100px;line-height:80px">凭证图片
          </el-col>
          <el-col class="form-border font-small" :span="18" style="height:100px">
            <img v-for="item in proofPics" @click="privewPic(item)" style="width:80px;height:80px" :src="item">
          </el-col>
        </el-row>
      </div>
      <div class="form-container-border">
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">订单金额</el-col>
          <el-col class="form-border font-small" :span="18">￥{{totalAmount}}</el-col>
        </el-row>
        <!--<div v-show="orderReturnApply.status!==3">
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6" style="height:52px;line-height:32px">选择收货点
          </el-col>
          <el-col class="form-border font-small" style="height:52px" :span="18">
            <el-select size="small"
                       style="width:200px"
                       :disabled="orderReturnApply.status!==0"
                       v-model="updateStatusParam.companyAddressId">
              <el-option v-for="address in companyAddressList"
                         :key="address.id"
                         :value="address.id"
                         :label="address.addressName">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">收货人姓名</el-col>
          <el-col class="form-border font-small" :span="18">{{currentAddress.name}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">所在区域</el-col>
          <el-col class="form-border font-small" :span="18">{{currentAddress | formatRegion}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">详细地址</el-col>
          <el-col class="form-border font-small" :span="18">{{currentAddress.detailAddress}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">联系电话</el-col>
          <el-col class="form-border font-small" :span="18">{{currentAddress.phone}}</el-col>
        </el-row>
        </div>-->
      </div>
      <div class="form-container-border" v-show="orderReturnApply.status!==0">
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">处理人员</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.handleMan}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">处理时间</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.handleTime | formatTime}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">物流公司</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.deliveryCompany}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">物流单号</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.deliverySn}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">发货人手机号</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.deliveryPhone}}</el-col>
        </el-row>
      </div>
      <div class="form-container-border" v-show="orderReturnApply.status===0">
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6" >审批操作</el-col>
          <el-col class="form-border font-small" :span="18">
            <el-radio v-model="tempStatus"  :label="1">同意</el-radio>
            <el-radio v-model="tempStatus"  :label="3">拒绝</el-radio>
          </el-col>
        </el-row>
        <div v-if="tempStatus == 1">
          <el-row >
            <el-col  class="form-border form-left-bg font-small" style="height: 53px" :span="6">物流公司</el-col>
            <el-col class="form-border font-small" :span="18">
              <el-select placeholder="请选择物流公司"
                         v-model="updateStatusParam.deliveryCompany"
                         size="small">
                <el-option v-for="item in companyOptions"
                           :key="item"
                           :label="item"
                           :value="item">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col  class="form-border form-left-bg font-small" style="height: 61px" :span="6">物流单号</el-col>
            <el-col class="form-border font-small" :span="18">
              <el-input v-model="updateStatusParam.deliverySn"  style="width: 300px"></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col  class="form-border form-left-bg font-small" style="height: 61px" :span="6">发件人手机号码</el-col>
            <el-col class="form-border font-small" :span="18">
              <el-input v-model="updateStatusParam.deliveryPhone"  style="width: 300px"></el-input>
            </el-col>
          </el-row>
        </div>
        <el-row v-if="tempStatus == 3">
          <el-col class="form-border form-left-bg font-small" :span="6" style="height:52px;line-height:32px">拒绝原因</el-col>
          <el-col class="form-border font-small" :span="18">
            <el-input  size="small" v-model="updateStatusParam.handleNote" style="width:200px;margin-left: 10px"></el-input>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top:15px;text-align: center" v-show="orderReturnApply.status===0">
        <el-button type="primary" size="small" @click="handleUpdateStatus">确定</el-button>
      </div>
    </el-card>
    <el-dialog :visible.sync="dialogVisible">
      <img v-if="dialogImageUrl != null" width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  import {getApplyDetail,updateApplyStatus} from '@/api/returnApply';
  import {fetchList} from '@/api/companyAddress';
  import {formatDate} from '@/utils/date';
  const defaultLogisticsCompanies=["顺丰快递","圆通快递","中通快递","韵达快递"];

  const defaultUpdateStatusParam = {
    companyAddressId: null,
    handleMan: 'admin',
    handleNote: null,
    receiveMan: 'admin',
    receiveNote: null,
    returnAmount: 0,
    status: 0,
    deliveryCompany: null,
    deliverySn: null,
    deliveryPhone: null
  };
  const defaultOrderReturnApply = {
    id: null,
    orderId: null,
    companyAddressId: null,
    productId: null,
    orderSn: null,
    createTime: null,
    memberUsername: null,
    returnAmount: null,
    returnName: null,
    returnPhone: null,
    status: null,
    handleTime: null,
    productPic: null,
    productName: null,
    productBrand: null,
    productAttr: null,
    productCount: null,
    productPrice: null,
    productRealPrice: null,
    reason: null,
    description: null,
    proofPics: null,
    handleNote: null,
    handleMan: null,
    receiveMan: null,
    receiveTime: null,
    receiveNote: null,
    deliveryCompany: null,
    deliverySn: null,
    deliveryPhone: null
  };
  export default {
    name: 'returnApplyDetail',
    data() {
      return {
        id: null,
        orderReturnApply: Object.assign({},defaultOrderReturnApply),
        productList: null,
        proofPics: null,
        updateStatusParam: Object.assign({}, defaultUpdateStatusParam),
        companyAddressList: null,
        dialogVisible: false,
        dialogImageUrl: null,
        tempStatus: 1,
        companyOptions:defaultLogisticsCompanies
      }
    },
    created() {
      this.id = this.$route.query.id;
      this.getDetail();
    },
    computed: {
      totalAmount() {
        if (this.orderReturnApply != null) {
          //return this.orderReturnApply.productRealPrice * this.orderReturnApply.productCount;
          return this.orderReturnApply.productRealPrice
        } else {
          return 0;
        }
      },
      currentAddress() {
        let id = this.updateStatusParam.companyAddressId;
        if(this.companyAddressList==null)return {};
        for (let i = 0; i < this.companyAddressList.length; i++) {
          let address = this.companyAddressList[i];
          if (address.id === id) {
            return address;
          }
        }
        return null;
      }
    },
    filters: {
      formatStatus(status) {
        if (status === 0) {
          return "待处理";
        } else if (status === 1) {
          return "换货中";
        } else if (status === 2) {
          return "已完成";
        } else {
          return "已拒绝";
        }
      },
      formatTime(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      formatRegion(address) {
        let str = address.province;
        if (address.city != null) {
          str += "  " + address.city;
        }
        str += "  " + address.region;
        return str;
      }
    },
    methods: {
      privewPic(pic) {
        this.dialogImageUrl = pic
        this.dialogVisible = true
      },
      handleViewOrder(){
        this.$router.push({path:'/oms/orderDetail',query:{id:this.orderReturnApply.orderId}});
      },
      getDetail() {
        getApplyDetail(this.id).then(response => {
          this.orderReturnApply = response.data;
          this.productList = [];
          this.productList.push(this.orderReturnApply);
          if (this.orderReturnApply.proofPics != null) {
            this.proofPics = this.orderReturnApply.proofPics.split(",")
          }
          //退货中和完成
          if(this.orderReturnApply.status===1||this.orderReturnApply.status===2){
            this.updateStatusParam.returnAmount=this.orderReturnApply.returnAmount;
            this.updateStatusParam.companyAddressId=this.orderReturnApply.companyAddressId;
          }
          this.getCompanyAddressList();
        });
      },
      getCompanyAddressList() {
        fetchList().then(response => {
          this.companyAddressList = response.data;
          for (let i = 0; i < this.companyAddressList.length; i++) {
            if (this.companyAddressList[i].receiveStatus === 1&&this.orderReturnApply.status===0) {
              this.updateStatusParam.companyAddressId = this.companyAddressList[i].id;
            }
          }
        });
      },
      handleUpdateStatus(){
        this.updateStatusParam.status=this.tempStatus;
        if (this.tempStatus == 1) {

          if (this.updateStatusParam.deliveryCompany == null || this.updateStatusParam.deliveryCompany == undefined || this.updateStatusParam.deliveryCompany == '') {
            this.$message({
              message: '物流公司必须选择',
              type: 'warning',
              duration: 1000
            });
            return false;
          }

          if (this.updateStatusParam.deliverySn == null || this.updateStatusParam.deliverySn == undefined || this.updateStatusParam.deliverySn == '') {
            this.$message({
              message: '物流单号必须输入',
              type: 'warning',
              duration: 1000
            });
            return false;
          }

          if (this.updateStatusParam.deliveryPhone == null || this.updateStatusParam.deliveryPhone == undefined || this.updateStatusParam.deliveryPhone == '') {
            this.$message({
              message: '发件人手机号码必须填写',
              type: 'warning',
              duration: 1000
            });
            return false;
          }
        } else {
          if (this.updateStatusParam.handleNote == null || this.updateStatusParam.handleNote == undefined || this.updateStatusParam.handleNote == '') {
            this.$message({
              message: '拒绝时，原因必填',
              type: 'warning',
              duration: 1000
            });
            return false;
          }
        }


        this.$confirm('是否要进行此操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateApplyStatus(this.id,this.updateStatusParam).then(response=>{
            this.$message({
              type: 'success',
              message: '操作成功!',
              duration:1000
            });
            this.$router.back();
          });
        });
      }
    }
  }
</script>
<style scoped>
  .detail-container {
    position: absolute;
    left: 0;
    right: 0;
    width: 1080px;
    padding: 35px 35px 15px 35px;
    margin: 20px auto;
  }

  .standard-margin {
    margin-top: 15px;
  }
  .form-border {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
  }

  .form-container-border {
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
    margin-top: 15px;
  }

  .form-left-bg {
    background: #F2F6FC;
  }
</style>


