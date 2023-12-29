<template>
  <div>
    <!-- <div>用户头像</div> -->
    <el-avatar
      src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      :size="100"
    />
    <div>
      <ElButton :icon="aim" @click="openDialog">更换头像</ElButton>
    </div>
  </div>
  <!-- <el-button type="primary" :icon="Search"></el-button> -->
  <Cropper ref="CropperRef" />
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { Cropper } from '../../../components/Cropper2/index'
import { useIcon } from '@/hooks/web/useIcon'
// import { onMounted } from 'vue'
// import mitt from 'mitt'
// const emitter = mitt()

const CropperRef = ref()
const openDialog = () => {
  CropperRef.value.openDialog()
}

const aim = useIcon({ icon: 'heroicons-outline:upload' })
</script>
<style></style>
