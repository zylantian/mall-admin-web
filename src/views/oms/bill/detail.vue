<template>
  <div class="detail-container" style="margin-top: -30px">
    <el-button size="small" @click="$router.back()" style="margin-left: 20px">返回</el-button>
    <el-card shadow="never" class="standard-margin">
      <span class="font-title-medium">发票信息</span>
      <div class="form-container-border">
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">发票状态</el-col>
          <el-col class="form-border font-small" :span="18">{{bill.status | formatStatus}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">提交时间</el-col>
          <el-col class="form-border font-small" :span="18">{{bill.createdAt | formatTime}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">发票金额</el-col>
          <el-col class="form-border font-small" :span="18">{{bill.orderMoney}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">发票类型</el-col>
          <el-col class="form-border font-small" :span="18">{{bill.type | formatType}}</el-col>
        </el-row>
        <div v-if="bill.type == 2">
          <el-row>
            <el-col class="form-border form-left-bg font-small" :span="6">单位名称</el-col>
            <el-col class="form-border font-small" :span="18">{{bill.enterName}}</el-col>
          </el-row>
          <el-row>
            <el-col class="form-border form-left-bg font-small" :span="6">单位纳税号</el-col>
            <el-col class="form-border font-small" :span="18">{{bill.enterSn}}</el-col>
          </el-row>
          <el-row>
            <el-col class="form-border form-left-bg font-small" :span="6">注册地址</el-col>
            <el-col class="form-border font-small" :span="18">{{bill.address}}</el-col>
          </el-row>
          <el-row>
            <el-col class="form-border form-left-bg font-small" :span="6">注册电话</el-col>
            <el-col class="form-border font-small" :span="18">{{bill.registerPhone}}</el-col>
          </el-row>
          <el-row>
            <el-col class="form-border form-left-bg font-small" :span="6">开户银行</el-col>
            <el-col class="form-border font-small" :span="18">{{bill.bankName}}</el-col>
          </el-row>
          <el-row>
            <el-col class="form-border form-left-bg font-small" :span="6">开户银行账号</el-col>
            <el-col class="form-border font-small" :span="18">{{bill.bankNo}}</el-col>
          </el-row>
          <el-row v-if="bill.status != 2">
            <el-col class="form-border form-left-bg font-small" :span="6" style="height:100px;line-height:80px">合同照片
            </el-col>
            <!--<el-col class="form-border font-small" :span="18" style="height:100px">
              <img style="width:80px;height:80px" :src="bill.contractUrl">
            </el-col>-->
            <el-col class="form-border font-small" :span="18" style="height:100px">
              <img v-for="item in proofPics" style="width:80px;height:80px" @click="privewPic(item)" :src="item">
            </el-col>
          </el-row>
          <div v-if="bill.status == 1 || bill.status == 5 || bill.status == 6">
            <el-row >
              <el-col class="form-border form-left-bg font-small" :span="6" >合同寄送物流公司
              </el-col>
              <el-col class="form-border font-small" :span="18">{{bill.contractDeliveryCompany}}</el-col>
            </el-row>
            <el-row >
              <el-col class="form-border form-left-bg font-small" :span="6" >合同寄送物流单号
              </el-col>
              <el-col class="form-border font-small" :span="18">{{bill.contractDeliverySn}}</el-col>
            </el-row>
            <el-row >
              <el-col class="form-border form-left-bg font-small" :span="6" >合同寄送人手机号码
              </el-col>
              <el-col class="form-border font-small" :span="18">{{bill.contractDeliveryPhone}}</el-col>
            </el-row>
          </div>

          <div v-if="bill.status == 1 || bill.status == 6">
            <el-row >
              <el-col class="form-border form-left-bg font-small" :span="6">发票寄送物流公司
              </el-col>
              <el-col class="form-border font-small" :span="18">{{bill.billDeliveryCompany}}</el-col>
            </el-row>
            <el-row >
              <el-col class="form-border form-left-bg font-small" :span="6" >发票寄送物流单号
              </el-col>
              <el-col class="form-border font-small" :span="18">{{bill.billDeliverySn}}</el-col>
            </el-row>
            <el-row >
              <el-col class="form-border form-left-bg font-small" :span="6">发票寄送人手机号码
              </el-col>
              <el-col class="form-border font-small" :span="18">{{bill.billDeliveryPhone}}</el-col>
            </el-row>
          </div>
        </div>
        <div v-if="bill.type == 1">
          <el-row>
            <el-col class="form-border form-left-bg font-small" :span="6">发票种类</el-col>
            <el-col class="form-border font-small" :span="18">{{bill.paperType | formatPaperType}}</el-col>
          </el-row>
          <div v-if="bill.subType == 1">
            <el-row>
              <el-col class="form-border form-left-bg font-small" :span="6">发票子类型</el-col>
              <el-col class="form-border font-small" :span="18">个人</el-col>
            </el-row>
            <el-row>
              <el-col class="form-border form-left-bg font-small" :span="6">个人姓名</el-col>
              <el-col class="form-border font-small" :span="18">{{bill.personalName}}</el-col>
            </el-row>
          </div>
          <div v-if="bill.subType == 2">
            <el-row>
              <el-col class="form-border form-left-bg font-small" :span="6">发票子类型</el-col>
              <el-col class="form-border font-small" :span="18">企业</el-col>
            </el-row>
            <el-row>
              <el-col class="form-border form-left-bg font-small" :span="6">单位名称</el-col>
              <el-col class="form-border font-small" :span="18">{{bill.enterName}}</el-col>
            </el-row>
            <el-row>
              <el-col class="form-border form-left-bg font-small" :span="6">纳税号</el-col>
              <el-col class="form-border font-small" :span="18">{{bill.enterSn}}</el-col>
            </el-row>
          </div>
          <el-row v-if="bill.paperType == 1 && (bill.pictureUrl != null && bill.pictureUrl != undefined)">
            <el-col class="form-border form-left-bg font-small" :span="6" style="height:100px;line-height:80px">电子普票
            </el-col>
            <el-col class="form-border font-small" :span="18" style="height:100px">
              <img style="width:80px;height:80px" :src="bill.pictureUrl">
            </el-col>
          </el-row>
        </div>
        <el-row>
          <el-col style="height:53px" class="form-border form-left-bg font-small" :span="6">订单汇总</el-col>
          <el-col class="form-border font-small" :span="18">{{bill | formatOrder}}
            <el-button type="text" size="small" @click="handleViewOrder(bill.orderIds)">查看详情</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-card shadow="never" v-if="bill.status == 3" class="standard-margin">
      <span class="font-title-medium">审核信息</span>
      <div class="form-container-border">
        <el-row>
          <el-col  class="form-border form-left-bg font-small" :span="6">审批操作</el-col>
          <el-col class="form-border font-small" :span="18">
            <el-radio v-model="tempStatus"  :label="1">同意</el-radio>
            <el-radio v-model="tempStatus"  :label="0">拒绝</el-radio>
          </el-col>
        </el-row>
        <el-row v-if="tempStatus == 0">
          <el-col  class="form-border form-left-bg font-small" style="height: 61px" :span="6">拒绝原因</el-col>
          <el-col class="form-border font-small" :span="18">
            <el-input v-model="failReason"  style="width: 300px"></el-input>
          </el-col>
        </el-row>

        <el-button type="primary" style="margin-top: 20px;margin-left: 300px" @click="approval()">确定</el-button>
      </div>
    </el-card>

    <el-card shadow="never" v-if="bill.status == 5" class="standard-margin">
      <span class="font-title-medium">发票物流信息</span>
      <div class="form-container-border">
        <el-row>
          <el-col  class="form-border form-left-bg font-small" style="height: 53px" :span="6">物流公司</el-col>
          <el-col class="form-border font-small" :span="18">
            <el-select placeholder="请选择物流公司"
                       v-model="deliveryCompany"
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
            <el-input v-model="deliverySn"  style="width: 300px"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col  class="form-border form-left-bg font-small" style="height: 61px" :span="6">寄件人手机号码</el-col>
          <el-col class="form-border font-small" :span="18">
            <el-input v-model="deliveryPhone"  style="width: 300px"></el-input>
          </el-col>
        </el-row>

        <el-button type="primary" @click="delivery()" style="margin-top: 20px;margin-left: 300px">确定</el-button>
      </div>
    </el-card>
    <el-dialog :visible.sync="dialogVisible">
      <img v-if="dialogImageUrl != null" width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  import {approval, delivery} from '@/api/bill'
  import {formatDate} from '@/utils/date';
  const defaultLogisticsCompanies=["顺丰快递","圆通快递","中通快递","韵达快递"];

  export default {
    name: 'billDetail',
    data() {
      return {
         bill: {},
         proofPics: [],
         tempStatus: 1,
         failReason: null,
         deliveryCompany: null,
         deliverySn: null,
         deliveryPhone: null,
         companyOptions:defaultLogisticsCompanies,
         dialogVisible: false,
         dialogImageUrl: null,
      }
    },
    created() {
      this.bill = JSON.parse(this.$route.query.bill);
      if (this.bill.contractUrl != undefined && this.bill.contractUrl != null) {
        this.proofPics = this.bill.contractUrl.split(',');
      }
    },
    computed: {
    },
    filters: {
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
          return '待专票邮寄';
        } else if (value === 6) {
          return '待确认收到专票';
        } else {
          return '已拒绝';
        }
      },
      formatType(value) {
        if (value == 1) return '普票发票'
        if (value == 2) return '增值税专用票'
      },
      formatPaperType(value) {
        if (value == 1) return '电子票'
        if (value == 2) return '纸质票'
      },
      formatTime(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      formatOrder(bill) {
        return '共' + bill.orderItems + '个订单，订单金额 ￥'  + bill.orderMoney + '元'
      }
    },
    methods: {
      privewPic(pic) {
        this.dialogImageUrl = pic
        this.dialogVisible = true
      },
      handleViewOrder(orderIds){
        this.$router.push({path:'/oms/billOrderList',query:{ids: JSON.stringify(orderIds)}});
      },
      approval() {
        if (this.tempStatus == 0 && (this.failReason == null || this.failReason == undefined || this.failReason == '')) {
          this.$message({
            message: '拒绝时，原因必填',
            type: 'warning',
            duration: 1000
          });
          return false;
        }
        this.$confirm('确定吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            id : this.bill.id,
            status: this.tempStatus,
            reason: this.failReason
          }
          approval(data).then(response=>{
            if (response.code == 200) {
              this.$message({
                message: '操作成功！',
                type: 'success',
                duration: 1000
              });
              this.$router.push({path:'/oms/billList'})
            } else {
              this.$message({
                message: response.message,
                type: 'warning',
                duration: 1000
              });
            }
          });
        })
      },
      delivery() {
          if (this.deliveryPhone == null || this.deliveryPhone == undefined || this.deliveryPhone == '') {
            this.$message({
              message: '专票寄送人手机号码必须填写',
              type: 'warning',
              duration: 1000
            });
            return false;
          }

        if (this.deliveryCompany == null || this.deliveryCompany == undefined || this.deliveryCompany == '') {
          this.$message({
            message: '专票物流公司必须选择',
            type: 'warning',
            duration: 1000
          });
          return false;
        }

        if (this.deliverySn == null || this.deliverySn == undefined || this.deliverySn == '') {
          this.$message({
            message: '专票物流单号必须输入',
            type: 'warning',
            duration: 1000
          });
          return false;
        }

          this.$confirm('确定吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let data = {
              id : this.bill.id,
              billDeliveryPhone: this.deliveryPhone,
              billDeliveryCompany: this.deliveryCompany,
              billDeliverySn: this.deliverySn
            }
            delivery(data).then(response=>{
              if (response.code == 200) {
                this.$message({
                  message: '操作成功！',
                  type: 'success',
                  duration: 1000
                });
                this.$router.push({path:'/oms/billList'})
              } else {
                this.$message({
                  message: response.message,
                  type: 'warning',
                  duration: 1000
                });
              }
            });
          })
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


