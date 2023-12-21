<template>
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
</template>

<script lang="ts" setup>
// import { ElMessage } from 'element-plus'
import UploadExcel from './UploadExcel.vue'
import { Ref, ref } from 'vue'
import { isArray } from 'lodash-es'
// import { addEnumitem } from '@/api/datascan'
// import { useI18n } from '@/hooks/web/useI18n'

const tableList: Ref<any[]> = ref([])

const getExcelList = (data: any[]) => {
  console.log('🚀 ~ file: Addexcel.vue:26 ~ getExcelList ~ data:', data)
  if (isArray(data)) {
    tableList.value = data
  }
}

const confirmEvent = async () => {
  // if (apivalue.value == '') {
  //   return ElMessage({
  //     message: '请先选择枚举项目',
  //     type: 'error'
  //   })
  // }
  // if (tableList.value.length === 0) {
  //   return ElMessage({
  //     message: '请先上传excel枚举文件',
  //     type: 'error'
  //   })
  // }
  await updateEnumitem()
}
const uploadComponent: Ref = ref(null)
// const clearForm = () => {
//   uploadComponent.value.clearFiles()
// }
const updateEnumitem = async () => {
  // try {
  //   const res = await addEnumitem({
  //     itemJson: JSON.stringify(tableList.value)
  //   })
  //   if (res?.data?.id) {
  //     clearForm()
  //     ElMessage({
  //       message: t('common.addSuccess'),
  //       type: 'success'
  //     })
  //   }
  // } catch (err) {
  //   console.log('🚀 ~ file: Addexcel.vue:145 ~ updateEnumitem ~ err:', err)
  //   ElMessage({
  //     message: t('common.addFail'),
  //     type: 'error'
  //   })
  // } finally {
  // }
}
</script>
