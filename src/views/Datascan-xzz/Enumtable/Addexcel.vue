<template>
  <el-text class="mx-1">枚举项目:</el-text>
  <div class="mb-6px"></div>
  <el-select
    v-model="apivalue"
    placeholder="选择对应枚举项目"
    :change="change(apivalue)"
    clearable
    class="mb-10px"
    label="枚举项目"
  >
    <el-option-group v-for="group in options" :key="group.label" :label="group.label">
      <el-option
        v-for="item in group.options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-option-group>
  </el-select>
  <el-divider />
  <UploadExcel @updatae-excel-list-by-son="getExcelList" />
  <el-divider />
  <el-text class="mx-1" type="success">当前excel文件夹的所有内容:</el-text>
  <el-text class="mx-1" type="danger">{{
    tableList.length > 0 ? '    共' + tableList.length + '项' : ''
  }}</el-text>
  <!-- <p>{{ tableList.length > 0 ? '共' + tableList.length + '项' : '' }}</p> -->
  <div class="mb-10px"></div>
  <Showtable :tableData="tableList" />
</template>

<script lang="ts" setup>
import { ElSelect, ElOptionGroup, ElOption } from 'element-plus'
import UploadExcel from './UploadExcel.vue'
import { ref } from 'vue'
import Showtable from './Showtable.vue'
// import { ref } from 'vue'
import { isArray } from 'lodash-es'

const tableList = ref([])
const change = (value: string) => {
  console.log('🚀 ~ file: Addexcel.vue:19 ~ change ~ value:', value)
  return {}
}

const apivalue = ref('')
const options = [
  {
    label: 'item日志',
    options: [
      {
        value: 'Shanghai',
        label: 'Reason操作类型字段'
      },
      {
        value: 'Beijing',
        label: '类型字段'
      }
    ]
  },
  {
    label: '金钱日志',
    options: [
      {
        value: 'Chengdu',
        label: 'Action动作类型字段'
      }
    ]
  }
]

const getExcelList = (data: any) => {
  if (isArray(data) && data.length > 0) {
    tableList.value = data
  }
}
</script>
