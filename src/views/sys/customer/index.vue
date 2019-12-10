<template>
  <div class="app-container">
        <!--工具栏-->
        <div class="head-container">
          <!-- 搜索 -->
          <el-input v-model="query.blurry" clearable size="small" placeholder="输入名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
          <el-date-picker
            v-model="query.createTime"
            :default-time="['00:00:00','23:59:59']"
            type="daterange"
            range-separator=":"
            size="small"
            class="date-item"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <el-select v-model="query.status" clearable size="small" placeholder="状态" class="filter-item" style="width: 90px" @change="toQuery">
            <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
          <!-- 新增 -->
          <el-button
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="showAddFormDialog"
          >新增</el-button>
          <!-- 导出 -->
          <el-button
            :loading="downloadLoading"
            size="mini"
            class="filter-item"
            type="warning"
            icon="el-icon-download"
            @click="downloadMethod"
          >导出</el-button>
        </div>
        <!--表单渲染-->
        <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" :title="getFormTitle()" append-to-body width="670px">
          <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item v-if="isAdd" label="密码" prop="password">
              <el-input type="password" v-model="form.password" />
            </el-form-item>
            <el-form-item label="电话" prop="phone">
              <el-input v-model.number="form.phone" />
            </el-form-item>
            <el-form-item  label="身份证" prop="identityCard">
              <el-input v-model="form.identityCard" />
            </el-form-item>
            <el-form-item label="会员等级" prop="roles">
              <el-select v-model="form.memberLevel.id" style="width: 437px" placeholder="请选择">
                <el-option
                  v-for="item in levels"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio v-for="item in dict.user_status" :key="item.id" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click="cancel">取消</el-button>
            <el-button :loading="loading" type="primary" @click="submitMethod">确认</el-button>
          </div>
        </el-dialog>
        <!--表格渲染-->
        <el-table v-loading="loading" :data="data" style="width: 100%;">
          <el-table-column :show-overflow-tooltip="true" prop="name" style="width: 15%;" label="姓名" />
          <el-table-column :show-overflow-tooltip="true" prop="phone" style="width: 15%;" label="电话" />
          <el-table-column :show-overflow-tooltip="true" prop="identityCard" style="width: 20%;" label="身份证" />
          <el-table-column :show-overflow-tooltip="true" style="width: 8%;" label="会员等级">
            <template slot-scope="scope">
              <div>{{ scope.row.memberLevel.name }} </div>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" style="width: 12%;" label="所属组织">
            <template slot-scope="scope">
              <div>{{ scope.row.dept.name }} </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="80" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-color="#409EFF"
                inactive-color="#F56C6C"
                @change="changeEnabled(scope.row, scope.row.status)"
              />
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="createTime" style="width: 15%;" label="创建日期">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="checkPermission(['admin','customer:edit','customer:del'])" label="操作" style="width: 15%;" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditFormDialog(scope.row)" />
              <el-popover
                :ref="scope.row.name"
                placement="top"
                width="180"
              >
                <p>确定重置密码吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.name].doClose()">取消</el-button>
                  <el-button  type="primary" size="mini" @click="resetpsd(scope.row.id)">确定</el-button>
                </div>
                <el-button slot="reference" type="primary" icon="el-icon-lock" size="mini" />
              </el-popover>
              <el-popover
                :ref="scope.row.id"
                placement="top"
                width="180"
              >
                <p>确定删除本条数据吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                  <el-button :loading="delLoading" type="primary" size="mini" @click="delMethod(scope.row.id)">确定</el-button>
                </div>
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <el-pagination
          :total="total"
          :current-page="page + 1"
          style="position:relative;display:flex;justify-content:center;align-items:center;margin-top:.5rem;margin-bottom:.25rem;padding-left:0;list-style:none"
          layout="total, prev, pager, next, sizes"
          @size-change="sizeChange"
          @current-change="pageChange"
        />
  </div>
</template>

<script>
import crud from '@/mixins/crud'
import crudCustomer from '@/api/system/customer'
import { resetPass } from '@/api/system/customer'
import { isvalidPhone } from '@/utils/validate'
import { isvalidUsername } from '@/utils/validate'
import {isValidIndentityCard} from '@/utils/validate'
import { getAll } from '@/api/system/umsMemberLevel'
export default {
  name: 'Customer',
  mixins: [crud],
  // 数据字典
  dicts: ['user_status'],
  data() {
    // 自定义验证
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    const validUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
      } else if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validIndentityCard = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入身份证号码'))
      } else if (!isValidIndentityCard(value)) {
        callback(new Error('请输入正确的身份证号码'))
      } else {
        callback()
      }
    }
    return {
      crudMethod: {
        ...crudCustomer
      },
      title: '客户',
      height: document.documentElement.clientHeight - 180 + 'px;',
      levels: [],
      defaultProps: { children: 'children', label: 'name' },
      enabledTypeOptions: [
        { key: 'true', display_name: '激活' },
        { key: 'false', display_name: '锁定' }
      ],
      form: { name: null, password: '123456', phone: null,  identityCard: null, memberLevel: {id: null}, status: 'true' },
      rules: {
        name: [
          { required: true, message: '请输入正确的用户名', trigger: 'blur' , validator: validUsername}
        ],
        email: [
          { required: true, message: '请输入正确的身份证号码', trigger: 'blur' , validator: validIndentityCard }
          ],
        phone: [
          { required: true, message: '请输入正确的手机号码', trigger: 'blur', validator: validPhone }
        ]
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  mounted: function() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  },
  methods: {
    beforeInit() {
      this.url = 'api/customer'
      return true
    },
    // 打开新增弹窗前做的操作
    beforeShowAddForm() {
      this.getMemberLevel()
    },
    // 打开编辑弹窗前做的操作
    beforeShowEditForm(data) {
      this.getMemberLevel()
      this.form.status = data.status.toString()
      this.form.memberLevel.id = data.memberLevel.id
    },
    // 提交前做的操作
    beforeSubmitMethod() {
      if (this.form.memberLevel.id === undefined) {
        this.$message({
          message: '会员等级不能为空',
          type: 'warning'
        })
        return false
      }
      return true
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.user_status[val] + '" ' + data.name + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.crudMethod.edit(data).then(res => {
          this.notify(this.dict.label.user_status[val] + '成功', 'success')
        }).catch(() => {
          data.status = !data.status
        })
      }).catch(() => {
        data.status = !data.status
      })
    },
    // 获取弹窗内角色数据
    getMemberLevel() {
      getAll().then(res => {
        this.levels = res.data
      }).catch(() => {})
    },
    addSuccessNotify() {
      this.$notify({
        title: '新增成功',
        type: 'success',
        duration: 2500
      })
    },
    resetpsd(id) {
      resetPass(id).then(res => {
        this.$notify({
          title: '重置密码成功，密码为123456',
          type: 'success',
          duration: 2500
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
