<script setup lang="ts">
import { Error } from '@/components/Error'
import { usePermissionStore } from '@/store/modules/permission'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { onMounted } from 'vue'

const { push } = useRouter()

const permissionStore = usePermissionStore()

const errorClick = () => {
  push(permissionStore.addRouters[0]?.path as string)
}
const userStore = useUserStore()

const clearInfo = () => {
  userStore.logout()
}
onMounted(async () => {
  // 本地持久化切换时需要手动设定
  // appStore.setDynamicRouter(!true)
  // appStore.setServerDynamicRouter(!true)
  // userStore.logout()
})
</script>

<template>
  <Error @error-click="errorClick" />
  <div @click="clearInfo">清空信息</div>
</template>
