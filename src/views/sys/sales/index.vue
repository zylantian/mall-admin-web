<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.name" clearable size="small" placeholder="输入商户名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
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
      <el-select v-model="query.enabled" clearable size="small" placeholder="状态" class="filter-item" style="width: 90px" @change="toQuery">
        <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="query.type" clearable size="small" placeholder="类型" class="filter-item" style="width: 180px" @change="toQuery">
        <el-option  :value="2" label="经销商"/>
        <el-option  :value="3" label="分仓"/>
        <el-option  :value="4" label="总仓"/>
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
    <!--表单组件-->
    <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="getFormTitle()" width="530px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="全名" prop="fullName">
          <el-input v-model="form.fullName" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="户名" prop="bankUserName">
          <el-input v-model="form.bankUserName" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="账号" prop="bankAccount">
          <el-input v-model="form.bankAccount" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="开户行" prop="bankName">
          <el-input v-model="form.bankName" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="主账号姓名" prop="managerName">
          <el-input v-model="form.managerName" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="主账号手机" prop="managerPhone">
          <el-input v-model="form.managerPhone" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="类型" >
          <el-radio  v-model="form.type" v-if="currentDeptType == 1"  :label="2">经销商</el-radio>
          <el-radio  v-model="form.type" v-if="currentDeptType == 1" :label="3">分仓</el-radio>
          <el-radio  v-model="form.type" v-if="currentDeptType == -1" :label="4">总仓</el-radio>
        </el-form-item>
        <el-form-item v-if="form.type != 0 && isAdd"  label="区域" :required="true">
          <el-cascader v-model="tempRegionList" style="width: 400px"
                       :options="areaList"
                       :props="{ checkStrictly: true , multiple: true}"
                       clearable></el-cascader>

          <!--<v-region @values="regionChange" v-model="form.regionList"></v-region>-->
        </el-form-item>
        <el-form-item label="三证合一" prop="pic">
          <single-upload v-model="form.pic"
                         style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
        </el-form-item>
        <!--<el-form-item v-if="form.type != 0"  label="账期" >
          <el-input v-model="form.accountPeriod" style="width: 370px;" />
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submitMethod">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table :loading="loading" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" default-expand-all :data="data" row-key="id" size="small">
      <el-table-column label="名称" prop="name" />
      <el-table-column label="主账号" prop="managerName" />
      <el-table-column label="主账号手机" prop="managerPhone" />
      <el-table-column label="类型" prop="type" >
        <template slot-scope="scope">
          <div >
            <span v-if="scope.row.type == 2" >经销商</span>
            <span v-if="scope.row.type == 3" >分仓</span>
            <span v-if="scope.row.type == 4" >总仓</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="所在区域">
        <template slot-scope="scope">
          <el-button  size="mini" type="text" icon="el-icon-edit" @click="showRegionList(scope.row)" > 修改区域 </el-button>
        </template>
      </el-table-column>
      <!--<el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            :disabled="scope.row.id === 1"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeEnabled(scope.row, scope.row.enabled,)"
          />
        </template>
      </el-table-column>-->
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column  v-if="checkPermission(['admin','dept:edit','dept:del'])" label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button  size="mini" type="primary" icon="el-icon-edit" @click="showEditFormDialog(scope.row)" />
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
            <el-button slot="reference" :disabled="scope.row.id === 1" type="danger" icon="el-icon-delete" size="mini" />
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
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
  import crud from '@/mixins/crud';
  import crudSales from '@/api/system/sales';
  import Treeselect from '@riophae/vue-treeselect';
  import '@riophae/vue-treeselect/dist/vue-treeselect.css';
  import MultiUpload from '@/components/Upload/multiUpload'
  import SingleUpload from '@/components/Upload/singleUpload'
  import {getCurrentDept} from '@/api/system/dept'
  import areaList from "../region/area.js";

  export default {
    name: 'Dept',
    components: { Treeselect, MultiUpload, SingleUpload},
    mixins: [crud],
    // 设置数据字典
    dicts: ['dept_status'],
    data() {
      return {
        title: '部门',
        crudMethod: { ...crudSales },
        depts: [],
        form: { id: null, name: null, fullName: null,pic: null,bankUserName: null, bankAccount: null, bankName:'',managerPhone: null, managerName: null, pid: 1, enabled: 'true', type: 3, region: { province: '430000', city: '430400', area: '430408', town: ''}, regionList: [], regionText: {}, accountPeriod: 90 },
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          managerPhone: [
            { required: true, message: '请输入主账号手机号码', trigger: 'blur' }
          ],
          managerName: [
            { required: true, message: '请输入主账号姓名', trigger: 'blur' }
          ],
          pic: [
            { required: true, message: '必须要上传三证合一的证件扫描件', trigger: 'blur'}
          ]
        },
        enabledTypeOptions: [
          { key: 'true', display_name: '正常' },
          { key: 'false', display_name: '禁用' }
        ],
        currentDeptType: null,
        areaList: areaList,
        tempRegionList: []
      }
    },
    created() {
      this.$nextTick(() => {
        getCurrentDept().then(res => {
          if (res.code == 200) {
            this.currentDeptType = res.data.type
            if (this.currentDeptType == -1) {
              this.form.type = 4
            } else {
              this.form.type = 3
            }
          }
        })
        this.init()
      })
    },
    methods: {
      showRegionList(obj) {
        this.$router.push({ path: "/sales/regionlist" , query: {dept: JSON.stringify(obj)}})
      },
      // 获取数据前设置好接口地址
      beforeInit() {
        this.url = 'api/sales'
        return true
      },
      // 打开新增弹窗前做的操作
      beforeShowAddForm() {
        this.tempRegionList = []
        this.getDepts()
      },
      // 打开编辑弹窗前做的操作
      beforeShowEditForm(data) {
        this.getDepts()
        this.form.enabled = data.enabled.toString()
      },
      // 提交前先做下验证
      beforeSubmitMethod() {
        if (!this.form.pid) {
          this.$message({
            message: '上级部门不能为空',
            type: 'warning'
          })
          return false
        }

        if (this.tempRegionList == undefined || this.tempRegionList == null || this.tempRegionList.length ==0) {
          this.$message({
            message: '一定要选择一个区域',
            type: 'warning'
          })
          return false
        }
        let regionList = []
        this.tempRegionList.forEach(region => {
          let temp = region[region.length - 1]
          regionList.push(temp)
        })

        this.form.regionList = regionList

        return true
      },
      // 改变状态
      changeEnabled(data, val) {
        this.$confirm('此操作将 "' + this.dict.label.dept_status[val] + '" ' + data.name + '部门, 是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.crudMethod.edit(data).then(res => {
            this.notify(this.dict.label.dept_status[val] + '成功', 'success')
          }).catch(err => {
            data.enabled = !data.enabled
            console.log(err.response.data.message)
          })
        }).catch(() => {
          data.enabled = !data.enabled
        })
      },
      // 获取所有部门
      getDepts() {
        this.crudMethod.getDepts({ enabled: true }).then(res => {
          this.depts = res.data.content
        })
      },
      regionChange (data) {
        this.form.regionText = data
      }
    }
  }
</script>

<style scoped>

</style>

