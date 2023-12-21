<!-- <template>
  <el-upload class="upload" accept=".xlsx,.xls" :before-upload="upload" drag action="" :limit="1">
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">将文件拖拽到此处 <em>点击上传</em></div>
    <template #tip>
      <div class="el-upload__tip"> .xlsx/.xls <slot></slot> </div>
    </template>
  </el-upload>
</template> -->

<template>
  <el-upload
    class="upload-demo"
    accept=".xlsx,.xls"
    ref="uploadForm"
    drag
    action=""
    :limit="1"
    :auto-upload="false"
    :on-change="getCurrentFile"
    style="width: 80%"
    :on-remove="clearList"
    :on-exceed="fileExceed"
  >
    <Icon icon="line-md:upload-loop" class="uploadIcon" :size="80" />
    <div class="el-upload__text"> 把excel文件拖到这里 或者 <em>点击选择文件</em> </div>
    <template #tip>
      <el-text class="mx-1" type="danger">每次只能上传一张表,且只能上传.xls/.xlsx文件</el-text>
    </template>
    <!-- <template #file>
      <Icon icon="vscode-icons:file-type-excel" />
    </template> -->
  </el-upload>
</template>

<script lang="ts" setup>
// 此依赖没有ts库??
import { ElMessage, UploadStatus } from 'element-plus'
import * as XLSX from 'xlsx/xlsx.mjs'
import { ref } from 'vue'
import { Ref } from 'vue'

const getCurrentFile = async (ev: any) => {
  //获取当前 文件  信息
  let file = ev.raw
  if (file.name.indexOf('xlsx') == -1 || file.name.indexOf('xls') == -1) {
    ElMessage({
      message: '请选择xlsx、xls格式文件',
      type: 'error'
    })
    return
  }
  if (!file) {
    ElMessage({
      message: '文件导入失败',
      type: 'error'
    })
    return
  } else {
    let data = await readFile(file)
    let workbook = XLSX.read(data, { type: 'binary' }) //解析二进制格式数据
    let worksheet = workbook.Sheets[workbook.SheetNames[0]] //获取第一个Sheet
    let rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) //json数据格式 指定header参数  会将每一行按前后顺序以数组返回
    if (rawData.length > 0) {
      const uploadData = rawData.map((item) => {
        return { key: item[0], value: item[1] }
      })
      emit('updataeExcelListBySon', uploadData)
    }
  }
}

const uploadForm: Ref = ref(null)

const clearFiles = (_status?: UploadStatus[]) => {
  uploadForm.value && uploadForm.value.clearFiles()
}
const fileExceed = () => {
  clearFiles()

  ElMessage({
    message: '每次只能上传一张表格,请重新选择文件!',
    type: 'error'
  })
}

//文件读取
const readFile = async (file) => {
  return new Promise((resolve) => {
    let reader = new FileReader()
    reader.readAsBinaryString(file) //以二进制的方式读取
    reader.onload = (ev) => {
      resolve(ev.target && ev.target.result)
    }
  })
}

const clearList = () => {
  emit('updataeExcelListBySon', [])
}

interface Emits {
  (e: 'updataeExcelListBySon', payload: any[]): void
}
//  触发父组件 事件
let emit = defineEmits<Emits>()

defineExpose({
  clearFiles
})
</script>

<style scoped>
svg {
  width: 40px;
  height: 40px;
  color: red;
}
/* .upload {
  max-width: 800px;
  margin: 0 auto;
} */
</style>
