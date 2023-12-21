<template>
  <div v-loading="loading">
    <UploadExcel @updatae-excel-list-by-son="getExcelList" ref="uploadComponent" />
    <el-divider />

    <el-text class="mx-1" type="success">当前excel文件夹的所有内容:</el-text>
    <el-table :data="tableList" style="width: 40%">
      <el-table-column type="index" width="50" />
      <el-table-column prop="sheetName" label="表名" />
      <el-table-column prop="length" label="数据长度" />
    </el-table>
    <el-divider />
    <el-button type="primary" @click="confirmEvent">确认提交</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import UploadExcel from './UploadExcel.vue'
import { Ref, ref } from 'vue'
import { isArray } from 'lodash-es'
import { addEnumitem } from '@/api/datascan'
import { useI18n } from '@/hooks/web/useI18n'

const tableList: Ref<any[]> = ref([])
const { t } = useI18n()
const loading = ref(false)
const getExcelList = (data: any[]) => {
  if (isArray(data) && data.length > 0) {
    formData.value = data
    const simpleData = data.map((item) => {
      return { sheetName: item.sheetName, length: item.sheetData.length }
    })
    tableList.value = simpleData
  }
}
const formData: Ref<updateEnumitem[]> = ref([])
const confirmEvent = async () => {
  if (tableList.value.length == 0 || formData.value.length == 0) {
    return ElMessage({
      message: '请先上传excel枚举文件',
      type: 'error'
    })
  }
  await updateEnumitem()
}
const uploadComponent: Ref = ref(null)
// const clearForm = () => {
//   uploadComponent.value.clearFiles()
// }
const updateEnumitem = async () => {
  try {
    loading.value = true
    const res = await addEnumitem(formData.value)
    console.log('🚀 ~ file: Addexcel.vue:55 ~ updateEnumitem ~ res:', res)
    // const res = { data: { ids: ['uuu'] } }
    if (res?.data.length > 0) {
      tableList.value = []
      formData.value = []
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
    loading.value = false
  }
}
</script>
