<template>
  <div class="app-container">
    <el-row :gutter="50">
      <!--侧边部门数据-->
      <el-col :xs="9" :sm="6" :md="4" :lg="4" :xl="4" style="padding-right: 0px">
        <div class="head-container">
          <el-input v-model="deptName" clearable size="small" placeholder="输入部门名称搜索" prefix-icon="el-icon-search" class="filter-item" @input="getDeptDatas" />
        </div>
        <el-tree style="margin-top: 10px" :data="deptDatas" :props="defaultProps" :expand-on-click-node="false" default-expand-all @node-click="handleNodeClick" />
      </el-col>
      <!--用户数据-->
      <el-col :xs="15" :sm="18" :md="20" :lg="20" :xl="20">
        <!--工具栏-->
        <div class="head-container">
          <!-- 搜索 -->
          <el-input v-model="query.blurry" clearable size="small" placeholder="输入名称或者手机号码搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
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
          <!--<el-button
            :loading="downloadLoading"
            size="mini"
            class="filter-item"
            type="warning"
            icon="el-icon-download"
            @click="downloadMethod"
          >导出</el-button>-->
        </div>
        <!--表单渲染-->
        <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" :title="getFormTitle()" append-to-body width="570px">
          <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="100px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username"  style="width: 200px" />
            </el-form-item>
            <el-form-item label="电话" prop="phone">
              <el-input v-model="form.phone" type="text" style="width: 200px" />
            </el-form-item>
            <el-form-item v-if="isAdd" label="密码" prop="password">
              <el-input type="password" v-model="form.password" style="width: 200px" />
            </el-form-item>
            <!--<el-form-item label="昵称" prop="nickName">
              <el-input v-model="form.nickName" />
            </el-form-item>-->
            <!--<el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" />
            </el-form-item>-->
            <el-form-item label="部门" prop="dept.id" v-if="currentRole < 3 && isAdd">
              <treeselect v-model="form.dept.id" :options="depts" style="width: 337px" placeholder="选择部门" @select="selectFun" />
            </el-form-item>
            <!--<el-form-item label="状态" v-if="isAdd">
              <el-radio-group v-model="form.status">
                <el-radio v-for="item in dict.user_status" :key="item.id" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>-->
            <el-form-item style="margin-bottom: 0;" label="角色">
              <el-select v-model="form.tempRole" style="width: 337px" placeholder="请选择">
                <el-option
                  v-for="(item, idx) in roles"
                  :key="idx"
                  :label="item.name"
                  :value="item.id"
                />
                <!-- :disabled="level !== 1 && item.level <= level" -->
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click="cancel">取消</el-button>
            <el-button :loading="loading" type="primary" @click="submitMethod">确认</el-button>
          </div>
        </el-dialog>
        <!--表格渲染-->
        <el-table v-loading="loading" :data="data" style="width: 100%;">
          <el-table-column :show-overflow-tooltip="true" prop="username" label="用户名" />
          <el-table-column :show-overflow-tooltip="true" prop="phone" width="120" label="电话" />
          <!--<el-table-column :show-overflow-tooltip="true" width="135" prop="email" label="邮箱" />-->
          <el-table-column :show-overflow-tooltip="true" width="120" label="角色">
            <template slot-scope="scope">
              <div>{{ scope.row.roles[0].name }} </div>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" width="120" label="部门">
            <template slot-scope="scope">
              <div>{{ scope.row.dept.name }} </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :disabled="scope.row.username === 'admin' || !hasStatusPermission(scope.row) || isSelf(scope.row)"
                active-color="#409EFF"
                inactive-color="#F56C6C"
                @change="changeEnabled(scope.row, scope.row.status)"
              />
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="createTime" width="150" label="创建日期">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="checkPermission(['admin','user:edit','user:del'])" label="操作" width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="scope.row.username !== 'admin' && hasPermission(scope.row) && !isSelf(scope.row) && isSonRole(scope.row)" size="mini" type="primary" icon="el-icon-edit" @click="showEditFormDialog(scope.row)" />
              <el-popover
                :ref="scope.row.username"
                placement="top"
                width="180"
                v-if="scope.row.username !== 'admin' &&  hasPermission(scope.row) && !isSelf(scope.row)"
              >
                <p>确定重置密码吗？</p>
                <div style="text-align: right; margin: 0" >
                  <el-button size="mini" type="text" @click="$refs[scope.row.username].doClose()">取消</el-button>
                  <el-button  type="primary" size="mini" @click="resetpsd(scope.row)">确定</el-button>
                </div>
                <el-button v-if="scope.row.username !== 'admin'" slot="reference" type="primary" icon="el-icon-lock" size="mini" />
              </el-popover>
              <el-popover
                :ref="scope.row.id"
                placement="top"
                width="180"
                v-if="scope.row.username !== 'admin' &&  hasPermission(scope.row) && !isSelf(scope.row) && isSonRole(scope.row)"
              >
                <p>确定删除本条数据吗？</p>
                <div  style="text-align: right; margin: 0" >
                  <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                  <el-button :loading="delLoading" type="primary" size="mini" @click="delMethod(scope.row.id)">确定</el-button>
                </div>
                <el-button v-if="scope.row.username !== 'admin' && !isSelf(scope.row)"  slot="reference" type="danger" icon="el-icon-delete" size="mini" />
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import crud from '@/mixins/crud'
import crudUser from '@/api/system/user'
import { resetPass } from '@/api/system/user'
import { isvalidPhone } from '@/utils/validate'
import { isvalidUsername } from '@/utils/validate'
import { getDepts } from '@/api/system/dept'
import { getAll, getLevel, getRoleDetail } from '@/api/system/role'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'User',
  components: { Treeselect },
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
      } /*else if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      }*/ else {
        callback()
      }
    }
    return {
      crudMethod: {
        ...crudUser
      },
      title: '用户',
      height: document.documentElement.clientHeight - 180 + 'px;',
      deptName: '', depts: [], deptDatas: [], jobs: [], level: 1, roles: [],currentRole: 0,
      currentUserId: -999,
      defaultProps: { children: 'children', label: 'name' },
      enabledTypeOptions: [
        { key: 'true', display_name: '激活' },
        { key: 'false', display_name: '锁定' }
      ],
      form: { username: null, nickName: null, password: '123456', email: null, status: 'true', roles: [], tempRole: null, roleId: null, dept: { id: null }, phone: null },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' , validator: validUsername}
        ],
        /*email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],*/
        phone: [
          { required: true, trigger: 'blur', validator: validPhone }
        ]
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.getDeptDatas()
      this.getRoleLevel()
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
      this.url = 'api/users'
      this.sort = "id,asc"
      return true
    },
    hasPermission(data) {
      let optLevel = data.roles[0].level
      return this.level <= optLevel
    },
    hasStatusPermission(data) {
      let optLevel = data.roles[0].level
      return this.level < optLevel
    },
    isSonRole(data) {
      if (this.currentRole == 1 || this.currentRole == 2) return true
      let role = data.roles[0]
      if (role.id == 3 || role.id == 11 || role.id == 7) return false
      let optLevel = role.level
      return this.currentRole == optLevel
    },
    isSelf(data) {
      return this.currentUserId === data.id
    },
    // 打开新增弹窗前做的操作
    beforeShowAddForm() {
      this.getDepts()
      this.getRoles()
      //this.getRoleLevel()
    },
    // 打开编辑弹窗前做的操作
    beforeShowEditForm(data) {
      console.log(data)
      this.getDepts()
      this.getRoles()

      // this.getJobs(this.form.dept.id)
      this.form.status = data.status.toString()
      /*let tempRoles = []
      data.roles.forEach(function(role, index) {
        tempRoles.push(role.id)
      })*/
      //this.form.tempRole = null
      //this.form.tempRole = data.roles[0].id
    },
    // 提交前做的操作
    beforeSubmitMethod() {
      if (this.currentRole < 3) {
        if (!this.form.dept.id) {
          this.$message({
            message: '部门不能为空',
            type: 'warning'
          })
          return false
        } else if (this.isAdd && (this.form.tempRole == null || this.form.tempRole == undefined)) {
          this.$message({
            message: '角色不能为空',
            type: 'warning'
          })
          return false
        }

      }
      if (this.isAdd) {
        const roles = []
        // this.form.roles.forEach(function(data, index) {
        const role = { id: this.form.tempRole }
        roles.push(role)
        // })
        this.form.roles = roles
      } else {
        if (this.form.tempRole != null && this.form.tempRole != undefined) {
          const roles = []
          // this.form.roles.forEach(function(data, index) {
          const role = { id: this.form.tempRole }
          roles.push(role)
          // })
          this.form.roles = roles
        }
      }

      return true
    },
    // 获取左侧部门数据
    getDeptDatas() {
      const sort = 'id,desc'
      const params = { sort: sort }
      if (this.deptName) { params['name'] = this.deptName }
      getDepts(params).then(res => {
        this.deptDatas = res.data.content
      })
    },
    // 获取弹窗内部门数据
    getDepts() {
      getDepts({ enabled: true }).then(res => {
        this.depts = res.data.content
      })
    },
    // 切换部门
    handleNodeClick(data) {
      if (data.pid === 0) {
        this.query.deptId = null
      } else {
        this.query.deptId = data.id
      }
      this.init()
    },
    // 改变状态
    changeEnabled(data, val) {
      if (data.username == 'admin') {
        this.$notify({
          title: 'admin不允许修改',
          type: 'success',
          duration: 2500
        })
        return;
      }
      this.$confirm('此操作将 "' + this.dict.label.user_status[val] + '" ' + data.username + ', 是否继续？', '提示', {
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
    getRoles() {
      getAll().then(res => {
        this.roles = res.data
      }).catch(() => {})
    },
    // 获取弹窗内岗位数据
    /*getJobs(id) {
      getAllJob(id).then(res => {
        this.jobs = res.content
      }).catch(() => {})
    },*/
    // 点击部门搜索对应的岗位
    selectFun(node, instanceId) {
      // this.getJobs(node.id)
    },
    // 获取权限级别
    getRoleLevel() {
      getLevel().then(res => {
        this.level = res.data.level
        this.currentUserId = res.data.userId
      }).catch(() => {})
      getRoleDetail().then(res => {
        this.currentRole = res.data.id
      })
    },
    addSuccessNotify() {
      this.$notify({
        title: '新增成功',
        type: 'success',
        duration: 2500
      })
    },
    resetpsd(data) {
      resetPass(data.id).then(res => {
        this.$notify({
          title: '重置密码成功，密码为123456',
          type: 'success',
          duration: 500
        })
        this.$refs[data.username].doClose()
      })

    }
  }
}
</script>

<style scoped>
</style>
