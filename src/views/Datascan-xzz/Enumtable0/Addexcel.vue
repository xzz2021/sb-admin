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
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
  <!-- <el-divider /> -->

  <el-divider />
  <UploadExcel @updatae-excel-list-by-son="getExcelList" ref="uploadComponent" />
  <el-divider />
  <!-- <el-button type="primary" @click="submit">提交</el-button> -->
  <el-popconfirm
    confirm-button-text="是的"
    cancel-button-text="取消"
    width="260px"
    :title="tipsTitle"
    @confirm="confirmEvent"
    @cancel="cancelEvent"
  >
    <template #reference>
      <el-button type="primary">提交</el-button>
    </template>
  </el-popconfirm>
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
import { ElSelect, ElOption, ElMessage } from 'element-plus'
import UploadExcel from './UploadExcel.vue'
import { Ref, ref, watch } from 'vue'
import Showtable from './Showtable.vue'
import { isArray } from 'lodash-es'
import { addEnumitem } from '@/api/datascan'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

const tableList: Ref<any[]> = ref([])
const change = (_value: string) => {
  console.log('🚀 ~ file: Addexcel.vue:55 ~ change ~ _value:', _value)
  return {}
}

const apivalue = ref('')
const options = [
  {
    value: 'item_Reason',
    label: 'item_Reason操作类型'
  },
  {
    value: 'item_ActionType',
    label: 'item_ActionType动作类型'
  },
  {
    value: 'money_Reason',
    label: 'money_Reason操作类型'
  },
  {
    value: 'money_MoneyType',
    label: 'money_MoneyType货币类型'
  }
]

const getExcelList = (data: any) => {
  if (isArray(data)) {
    tableList.value = data
  }
}
let tipsTitle = ref('')
watch(
  () => `当前提交的项目是:${apivalue.value}, 当前共提交了${tableList.value.length}项,确认提交吗?`,
  (newTips) => {
    tipsTitle.value = newTips
  },
  { immediate: true }
)

const confirmEvent = async () => {
  if (apivalue.value == '') {
    return ElMessage({
      message: '请先选择枚举项目',
      type: 'error'
    })
  }
  if (tableList.value.length === 0) {
    return ElMessage({
      message: '请先上传excel枚举文件',
      type: 'error'
    })
  }
  await updateEnumitem()
}
const uploadComponent: Ref = ref(null)
const clearForm = () => {
  apivalue.value = ''
  uploadComponent.value.clearFiles()
  tableList.value = []
}
const updateEnumitem = async () => {
  try {
    const res = await addEnumitem({
      enumName: apivalue.value,
      itemJson: JSON.stringify(tableList.value)
    })
    if (res?.data?.id) {
      clearForm()
      ElMessage({
        message: t('common.addSuccess'),
        type: 'success'
      })
    }
  } catch (err) {
    console.log('🚀 ~ file: Addexcel.vue:145 ~ updateEnumitem ~ err:', err)
    ElMessage({
      message: t('common.addFail'),
      type: 'error'
    })
  } finally {
  }
}

const cancelEvent = () => {
  console.log('file: Addexcel.vue:19 ~ cancelEvent')
}
</script>
