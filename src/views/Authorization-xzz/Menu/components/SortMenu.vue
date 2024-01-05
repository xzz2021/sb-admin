<script setup lang="ts">
import { usePermissionStore } from '@/store/modules/permission'
import { ref } from 'vue'
import { Dialog } from '@/components/Dialog'
import { useDraggable } from 'vue-draggable-plus/dist/vue-draggable-plus'
import { type UseDraggableReturn } from 'vue-draggable-plus/dist/index'
const permissionStore = usePermissionStore()
const sortMenu = permissionStore.getSortMenu
const dialogVisible = ref(!false)

const openDialog = () => {
  dialogVisible.value = true
}
const dragableWrapRef = ref()
useDraggable<UseDraggableReturn>(dragableWrapRef, sortMenu, {
  animation: 150,
  ghostClass: 'ghost',
  onStart() {
    console.log('start')
  },
  onUpdate() {
    console.log('update')
  }
})
</script>

<template>
  <ElButton type="primary" @click="openDialog">菜单排序</ElButton>
  <Dialog v-model="dialogVisible" title="拖动菜单排序">
    <div ref="dragableWrapRef">
      <div v-for="item in sortMenu" :key="item.id">
        <p>{{ item.title }}</p>
      </div>
    </div>
  </Dialog>
</template>
