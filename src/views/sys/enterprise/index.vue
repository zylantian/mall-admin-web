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
    <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" :title="getFormTitle()" append-to-body width="500px">
      <el-form ref="form" :inline="true" :model="form" size="small" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.username" />
        </el-form-item>
        <!--<el-form-item label="电话" prop="phone">
          <el-input v-model.number="form.phone" />
        </el-form-item>-->
        <el-form-item  label="企业名称" prop="enterName">
          <el-input v-model="form.enterName" />
        </el-form-item>
        <el-form-item  label="是否VIP" prop="vip">
          <el-switch
            v-model="form.isVip"
            active-color="#409EFF"
            inactive-color="#F56C6C"
          />
        </el-form-item>
        <el-form-item v-if="form.isVip" label="赊账额度(元)" prop="creditAmount">
          <el-input type="number" v-model="form.creditAmount" />
        </el-form-item>
        <el-form-item v-if="form.isVip" label="账期（天）" prop="creditDays">
          <el-input type="number" v-model="form.creditDays" />
        </el-form-item>
        <!--<el-form-item label="税务号" prop="enterSn">
          <el-input v-model="form.enterSn" />
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submitMethod">确认</el-button>
      </div>
    </el-dialog>
        <!--表格渲染-->
        <el-table v-loading="loading" :data="data" style="width: 100%;">
          <el-table-column :show-overflow-tooltip="true" prop="username" style="width: 15%;" label="姓名" />
          <el-table-column :show-overflow-tooltip="true" prop="phone" style="width: 15%;" label="电话" />
          <el-table-column :show-overflow-tooltip="true" prop="enterName" style="width: 20%;" label="企业全称" />
          <el-table-column :show-overflow-tooltip="true" prop="enterSn" style="width: 8%;" label="税务识别码"/>
          <el-table-column :show-overflow-tooltip="true" prop="teamName" style="width: 8%;" label="项目名称"/>
          <el-table-column :show-overflow-tooltip="true" prop="teamRegion" style="width: 8%;" label="项目地址"/>
          <el-table-column :show-overflow-tooltip="true" prop="salesName" style="width: 12%;" label="供应商名称"/>
          <el-table-column label="状态" width="80" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status == 1? true: false"
                active-color="#409EFF"
                inactive-color="#F56C6C"
                @change="changeEnabled(scope.row, scope.row.status)"
              />
            </template>
          </el-table-column>
          <el-table-column label="VIP" width="80" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isVip == 1? true: false"
                active-color="#409EFF"
                inactive-color="#F56C6C"
                @change="changeVip(scope.row, scope.row.isVip)"
              />
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="" style="width: 12%;" label="赊账额度（元）">
            <template slot-scope="scope" v-if="scope.row.isVip">
              <span>{{ scope.row.creditAmount }}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" style="width: 12%;" label="账期（天）">
            <template slot-scope="scope" v-if="scope.row.isVip">
              <span>{{ scope.row.creditDays }}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="createTime" style="width: 15%;" label="创建日期">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="checkPermission(['admin','enter:edit','enter:del'])" label="操作" style="width: 15%;" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditFormDialog(scope.row)" />
              <!--<el-popover
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
              </el-popover>-->
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
import crudEnterprise from '@/api/system/enterprise'
export default {
  name: 'EnterPrise',
  mixins: [crud],
  // 数据字典
  dicts: ['user_status'],
  data() {
    return {
      crudMethod: {
        ...crudEnterprise
      },
      title: '企业信息',
      height: document.documentElement.clientHeight - 180 + 'px;',
      levels: [],
      defaultProps: { children: 'children', label: 'name' },
      enabledTypeOptions: [
        { key: 'true', display_name: '激活' },
        { key: 'false', display_name: '锁定' }
      ],
      form: { username: null, phone: null, enterName: null,  enterSn: null, status: 'true' }
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
      this.url = 'api/enterprise?sourceType=1'
      return true
    },
    // 打开新增弹窗前做的操作
    // 打开编辑弹窗前做的操作
    beforeShowEditForm(data) {
      this.form.status = data.status.toString()
    },
    // 改变状态
    changeEnabled(data, val) {
      if (val == 1) {
        val = false
      } else {
        val = true
      }
      this.$confirm('此操作将 "' + this.dict.label.user_status[val] + '" ' + data.enterName + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (data.status == 0) {
          data.status = 1
        } else if (data.status == 1){
          data.status = 0
        }
        this.crudMethod.edit(data).then(res => {
          this.notify(this.dict.label.user_status[val] + '成功', 'success')
        }).catch(() => {
          if (data.status = 0) {
            data.status = 1
          } else {
            data.status = 0
          }
        })
      }).catch(() => {
        data.status = !data.status
      })
    },
    changeVip(data, val) {
      if (val) {
        val = false
      } else {
        val = true
      }
      let text
      if (val) {
        text = '此操作将设置 ' + data.enterName + '及其员工 为VIP, 是否继续？'
      } else {
        text = '此操作将取消 ' + data.enterName + '及其员工 的VIP资格, 是否继续？'
      }

      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (!data.isVip) {
          data.isVip = true
        } else {
          data.isVip = false
        }
        this.crudMethod.edit(data).then(res => {
          this.notify('VIP设置成功', 'success')
        }).catch(() => {
          if (!data.isVip) {
            data.isVip = true
          } else {
            data.isVip = false
          }
        })
      }).catch(() => {

      })
    }
  }
}
</script>

<style scoped>
</style>
