<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right;margin-right: 15px"
          type="primary"
          @click="toQuery()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="resetQuery()"
          size="small">
          重置
        </el-button>
      </div>
      <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="getFormTitle()" width="530px">
        <el-form ref="form"  :model="form"  size="small" label-width="80px">
          <el-form-item  label="区域" :required="true">
            <el-cascader v-model="tempRegionList" style="width: 400px"
                         :options="areaList"
                         :props="{ checkStrictly: true , multiple: true}"
                         clearable></el-cascader>

          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="cancel">取消</el-button>
          <el-button :loading="loading" type="primary" @click="submitMethod">确认</el-button>
        </div>
      </el-dialog>
      <div style="margin-top: 15px">
        <el-form :inline="true" size="small" label-width="140px">
          <el-form-item label="区域名称：">
            <el-input v-model="query.regionName" class="input-width" placeholder="区域名称"></el-input>
          </el-form-item>
          <el-form-item label="区域类型：">
            <el-select v-model="query.regionType" class="input-width" placeholder="全部" clearable>
              <el-option v-for="item in typeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <el-form>
        <el-row>
          <el-col :span="20">
            <el-form-item label="商户名称：">
              <span>{{dept.name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button
              class="btn-add"
              @click="showAddFormDialog"
              size="mini">
              添加区域
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable"
                :data="data"
                style="width: 100%;"
                v-loading="loading" border>
        <el-table-column label="区域名称" min-width="15%"  :show-overflow-tooltip="true"  prop="regionName" align="center"></el-table-column>
        <el-table-column label="区域类型" min-width="15%" :show-overflow-tooltip="true"  align="center">
          <template  slot-scope="scope">
            <span>{{formatType(scope.row.regionType)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="14%" align="center">
          <template slot-scope="scope">
            <el-popover
              :ref="scope.row.id"
              placement="top"
              width="180"
            >
              <p>确定删除本条数据吗？</p>
              <div  style="text-align: right; margin: 0" >
                <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                <el-button :loading="delLoading" type="primary" size="mini" @click="delMethod(scope.row.id)">确定</el-button>
              </div>
              <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        :total="total"
        :current-page="page + 1"
        style="position:relative;display:flex;justify-content:center;align-items:center;margin-top:.5rem;margin-bottom:.25rem;padding-left:0;list-style:none"
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChange"
        @current-change="pageChange"
      />
    </div>
  </div>
</template>
<script>
  import crud from '@/mixins/crud'
  import crudDeptRegion from '@/api/system/deptRegion'
  import areaList from "../region/area.js";
  export default {
    name: "deptRegionList",
    mixins: [crud],
    data() {
      return {
        crudMethod: {
          ...crudDeptRegion
        },
        typeOptions: [
          {
            label: '省/直辖市',
            value: 'PROVINCE'
          },
          {
            label: '市',
            value: 'CITY'
          },
          {
            label: '区/县',
            value: 'COUNTY'
          }
        ],
        dept: {},
        title: '覆盖区域',
        areaList: areaList,
        tempRegionList: [],
        form: {}
      }
    },
    created() {
      this.dept = JSON.parse(this.$route.query.dept)
      this.$nextTick(() => {
        this.init();
      }, 500)
    },
    filters: {
    },
    methods: {
      beforeShowAddForm() {
        this.form = {}
        this.tempRegionList = []
      },
      beforeInit() {
        this.url = '/api/dept/region/list'
        this.query.deptId = this.dept.id
        return true
      },
      formatType(value) {
        if (value == 'PROVINCE') return '省/直辖市'
        if (value == 'CITY') return '市'
        if (value == 'COUNTY') return '区/县'
      },
      // 提交前先做下验证
      beforeSubmitMethod() {

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
        this.form.id = this.dept.id

        return true
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>


