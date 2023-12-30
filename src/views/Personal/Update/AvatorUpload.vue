<template>
  <div>
    <!-- <div>用户头像</div> -->
    <!-- :src="userStore?.getUserInfo?.avator ? avatarURL : userStore?.getUserInfo?.avator" -->
    <el-avatar
      :src="userStore?.userInfo?.avator ? userStore?.userInfo?.avator : avatarURL"
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
import { useUserStore } from '@/store/modules/user'
// import { onMounted } from 'vue';

import avatarURL from '../../../assets/imgs/avatar.jpg'

const userStore = useUserStore()

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
