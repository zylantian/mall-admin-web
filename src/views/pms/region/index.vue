<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button  v-if="currentDept.type == 4 || currentDept.type == 2 || currentDept.type == 3"
          style="float:right;margin-right: 15px"
          class="btn-add"
          @click="transform()"
          size="small">
          新增商品区域价格设定
        </el-button>
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
    <div class="table-container">
      <el-table ref="table"
                :data="data"
                style="width: 100%;"
                v-loading="loading" border>
        <el-table-column label="商品名称" min-width="15%"  :show-overflow-tooltip="true"  prop="productName" align="center"></el-table-column>
        <el-table-column label="商户名" min-width="15%" :show-overflow-tooltip="true"  prop="deptName" align="center"/>
        <el-table-column label="区域名称" min-width="15%"  :show-overflow-tooltip="true"  prop="regionName" align="center"></el-table-column>
        <el-table-column label="区域类型" min-width="15%" :show-overflow-tooltip="true"  align="center">
          <template  slot-scope="scope">
            <span>{{formatType(scope.row.regionType)}}</span>
          </template>
        </el-table-column>
          <el-table-column label="入库价格" min-width="15%"  :show-overflow-tooltip="true"  prop="originPrice" align="center"></el-table-column>
          <el-table-column label="销售价格" min-width="15%"  :show-overflow-tooltip="true"  prop="destPrice" align="center"></el-table-column>

          <el-table-column label="操作" min-width="14%" align="center">
          <template slot-scope="scope">
            <el-popover  v-if="currentDept.id == scope.row.deptId"
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
  import crudProductRegion from '@/api/productRegion'
  import areaList from "../../sys/region/area.js";
  import {getCurrentDept} from '@/api/system/dept'

  export default {
    name: "deptRegionList",
    mixins: [crud],
    data() {
      return {
        crudMethod: {
          ...crudProductRegion
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
        //dept: {},
        title: '覆盖区域',
        areaList: areaList,
        form: {},
        currentDept: {}
      }
    },
    created() {
      //this.dept = JSON.parse(this.$route.query.dept)
      this.$nextTick(() => {
        getCurrentDept().then(res => {
          if (res.code == 200) {
            this.currentDept = res.data
          }
        })
        this.init();
      }, 500)
    },
    filters: {
    },
    methods: {
      transform() {
        this.$router.push({path:'/pms/regionPrice'})
      },
      beforeInit() {
        this.url = '/product/region/list'
        return true
      },
      formatType(value) {
        if (value == 'PROVINCE') return '省/直辖市'
        if (value == 'CITY') return '市'
        if (value == 'COUNTY') return '区/县'
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>


