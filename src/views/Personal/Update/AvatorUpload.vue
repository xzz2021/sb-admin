<template>
  <el-upload
    action="#"
    ref="upload"
    list-type="picture"
    :auto-upload="false"
    :limit="1"
    :on-exceed="handleExceed"
  >
    <Icon icon="icon-park-outline:upload-one" color="#6e7b87" :size="30" class="avatorEdit" />
    <template #file="{ file }">
      <!-- el-upload-list el-upload-list--picture -->
      <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
    </template>
  </el-upload>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
// import { genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'

const upload = ref<UploadInstance>()
//  上传文件超出一个 限制  自动移除 并 更换 新文件
const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = Date.now() + file.uid++
  upload.value!.handleStart(file)
}
</script>
<style>
.avatorEdit {
  position: absolute;
  left: 74px;
  bottom: 0px;
  z-index: 99;
}
.el-upload-list__item.is-ready {
  border-radius: 50% 50%;
}
</style>
