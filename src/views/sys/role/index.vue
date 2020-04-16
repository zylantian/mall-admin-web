<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.blurry" size="small" clearable placeholder="输入名称或者描述搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
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
    <!-- 表单渲染 -->
    <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" :title="getFormTitle()" append-to-body width="600px">
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="95px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" style="width: 130px;" />
        </el-form-item>
        <el-form-item label="数据范围" prop="dataScope">
          <el-select v-model="form.dataScope" style="width: 130px" placeholder="请选择范围" @change="changeScope">
            <el-option
              v-for="item in dateScopes"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述信息" prop="remark">
          <el-input v-model="form.remark" style="width: 380px;" rows="5" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submitMethod">确认</el-button>
      </div>
    </el-dialog>
    <el-row :gutter="15">
      <!--角色管理-->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17" style="margin-bottom: 10px">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">角色列表</span>
          </div>
          <el-table v-loading="loading" :data="data" highlight-current-row style="width: 100%;" @current-change="handleCurrentChange">
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="dataScope" label="数据权限" />
            <!--<el-table-column :show-overflow-tooltip="true" prop="remark" label="描述" />-->
            <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <!--<el-table-column  label="操作" width="130px" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button v-if="scope.row.id > 6" size="mini" type="primary" icon="el-icon-edit" @click="showEditFormDialog(scope.row)" />
                <el-popover
                  :ref="scope.row.id"
                  placement="top"
                  width="180"
                  v-if="scope.row.id > 10"
                >
                  <p>确定删除本条数据吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                    <el-button :loading="delLoading" type="primary" size="mini" @click="delMethod(scope.row.id)">确定</el-button>
                  </div>
                  <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
                </el-popover>
              </template>
            </el-table-column>-->
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
        </el-card>
      </el-col>
      <!-- 菜单授权 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip class="item" effect="dark" content="选择指定角色分配菜单" placement="top">
              <span class="role-span">菜单分配</span>
            </el-tooltip>
            <el-button
              :disabled="!showButton"
              :loading="menuLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="saveMenu"
            >保存</el-button>
          </div>
          <el-tree
            ref="menu"
            :data="menus"
            :default-checked-keys="menuIds"
            :props="defaultProps"
            check-strictly
            accordion
            show-checkbox
            node-key="id"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import crud from '@/mixins/crud'
import crudRoles from '@/api/system/role'
import { getDepts } from '@/api/system/dept'
import { getMenusTree } from '@/api/system/menu'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'Role',
  components: { Treeselect },
  mixins: [crud],
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      title: '角色',
      dateScopes: ['全部', '本级'],
      crudMethod: { ...crudRoles },
      currentId: 0, menuLoading: false, showButton: false,
      menus: [], menuIds: [], depts: [],
      form: { name: null, depts: [], remark: null, dataScope: null, level: 3, permission: null },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getMenus()
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    // 获取数据前设置好接口地址
    beforeInit() {
      this.showButton = false
      this.url = 'api/roles'
      this.sort = 'level,asc'
      // 清空菜单的选中
      this.$refs.menu.setCheckedKeys([])
      return true
    },
    // 打开编辑弹窗前做的操作
    beforeShowEditForm(data) {
      if (data.dataScope === '自定义') {
        this.getDepts()
      }
      const depts = []
      if (data.depts != null) {
        data.depts.forEach(function(dept, index) {
          depts.push(dept.id)
        })
      }
      this.form.depts = depts
    },
    // 提交前做的操作
    beforeSubmitMethod() {
      if (this.form.dataScope === '自定义' && this.form.depts.length === 0) {
        this.$message({
          message: '自定义数据权限不能为空',
          type: 'warning'
        })
        return false
      } else {
        const depts = []
        this.form.depts.forEach(function(data, index) {
          const dept = { id: data }
          depts.push(dept)
        })
        this.form.depts = depts
      }
      return true
    },
    // 获取所有菜单
    getMenus() {
      getMenusTree().then(res => {
        this.menus = res.data
      })
    },
    // 触发单选
    handleCurrentChange(val) {
      if (val) {
        const _this = this
        // 清空菜单的选中
        this.$refs.menu.setCheckedKeys([])
        // 保存当前的角色id
        this.currentId = val.id
        // 点击后显示按钮
        this.showButton = true
        // 初始化
        this.menuIds = []
        // 菜单数据需要特殊处理
        val.menus.forEach(function(data, index) {
          _this.menuIds.push(data.id)
        })
      }
    },
    // 保存菜单
    saveMenu() {
      this.menuLoading = true
      const role = { id: this.currentId, menus: [] }
      // 得到半选的父节点数据，保存起来
      this.$refs.menu.getHalfCheckedNodes().forEach(function(data, index) {
        const menu = { id: data.id }
        role.menus.push(menu)
      })
      // 得到已选中的 key 值
      this.$refs.menu.getCheckedKeys().forEach(function(data, index) {
        const menu = { id: data }
        role.menus.push(menu)
      })
      this.crudMethod.editMenu(role).then(res => {
        this.notify('保存成功', 'success')
        this.menuLoading = false
        this.getMenus()
        this.init()
        this.update()
      }).catch(err => {
        this.menuLoading = false
        console.log(err.response.data.message)
      })
    },
    // 改变数据
    update() {
      // 无刷新更新 表格数据
      this.crudMethod.get(this.currentId).then(res => {
        for (let i = 0; i < this.data.length; i++) {
          if (res.id === this.data[i].id) {
            this.data[i] = res
            break
          }
        }
      })
    },
    // 获取部门数据
    getDepts() {
      getDepts({ enabled: true }).then(res => {
        this.depts = res.content
      })
    },
    // 如果数据权限为自定义则获取部门数据
    changeScope() {
      if (this.form.dataScope === '自定义') {
        this.getDepts()
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .role-span {
    font-weight: bold;color: #303133;
    font-size: 15px;
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
