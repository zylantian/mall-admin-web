<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="orderSetting"
             ref="orderSettingForm"
             :rules="rules"
             label-width="150px">
      <el-form-item label="原密码：" prop="oldPwd">
        <el-input v-model="orderSetting.oldPwd" :type="pwdType" class="input-width">
          <!--<span slot="prefix">
            <svg-icon icon-class="password" class="color-main"></svg-icon>
          </span>-->
          <span slot="suffix" @click="showPwd">
            <svg-icon icon-class="eye" class="color-main"></svg-icon>
          </span>
        </el-input>
      </el-form-item>
      <el-form-item label="新密码：" prop="newPwd">
        <el-input v-model="orderSetting.newPwd" :type="pwdType" class="input-width">
          <span slot="suffix" @click="showPwd">
            <svg-icon icon-class="eye" class="color-main"></svg-icon>
          </span>
        </el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="confirmPwd">
        <el-input v-model="orderSetting.confirmPwd" :type="pwdType" class="input-width">
          <span slot="suffix" @click="showPwd">
            <svg-icon icon-class="eye" class="color-main"></svg-icon>
          </span>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          @click="confirm('orderSettingForm')"
          type="primary">提交</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {updatePwd} from '@/api/system/user'
  const defaultOrderSetting = {
    oldPwd: null,
    newPwd: null,
    confirmPwd: null
  };
  const checkTime = (rule, value, callback) => {
    if (!value) {
      return callback(new Error('不能为空'));
    }

    if (value.length<8) {
      return callback(new Error('不能少于8位'));
    }
    callback();
  };
  const checkOld = (rule, value, callback) => {
    if (!value) {
      return callback(new Error('不能为空'));
    }
    callback();
  };
  export default {
    name: 'resetPwdTwo',
    data() {
      return {
        orderSetting: Object.assign({}, defaultOrderSetting),
        rules: {
          oldPwd:{validator: checkOld, trigger: 'blur' },
          newPwd:{validator: checkTime, trigger: 'blur' },
          confirmPwd: {validator: checkTime, trigger: 'blur' }
        },
        pwdType: 'password'
      }
    },
    created(){
    },
    methods:{
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      confirm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.orderSetting.confirmPwd !== this.orderSetting.newPwd) {
              this.$message({
                message: '新密码两次输入不一致',
                type: 'warning'
              });
              return false;
            }
            this.$confirm('是否要提交修改?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let data = {
                'oldPass': this.orderSetting.oldPwd,
                'newPass': this.orderSetting.newPwd
              }
              updatePwd(data).then(response=>{
                if (response.code == 200) {
                  this.$message({
                    type: 'success',
                    message: '修改成功!',
                    duration:1000
                  });
                  this.$store.dispatch('LogOut').then(() => {
                    location.reload() // 为了重新实例化vue-router对象 避免bug
                  })
                } else {
                  this.$message({
                    type: 'success',
                    message: response.message,
                    duration:1000
                  });
                }
              })
            });
          } else {
            this.$message({
              message: '提交参数不合法',
              type: 'warning'
            });
            return false;
          }
        });
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 50%;
  }

  .note-margin {
    margin-left: 15px;
  }
</style>


