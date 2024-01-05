<script setup lang="ts">
import { usePermissionStore } from '@/store/modules/permission'
import { ref } from 'vue'
import { Dialog } from '@/components/Dialog'
import { useDraggable, type UseDraggableReturn } from 'vue-draggable-plus'
const permissionStore = usePermissionStore()
const sortMenu = permissionStore.getSortMenu
const dialogVisible = ref(false)

const openDialog = () => {
  dialogVisible.value = true
  // dialog实例必须在打开后才能挂载
  useDraggable<UseDraggableReturn>(dragableWrapRef, newSortMenu, {
    animation: 150,
    ghostClass: 'ghost',
    onStart() {
      console.log('start')
    },
    onUpdate() {
      console.log('update')
      console.log('🚀 ~ file: SortMenu.vue:23 ~ onUpdate ~ newSortMenu:', newSortMenu.value)
    }
  })
}
const newSortMenu = ref(sortMenu)
console.log('🚀 ~ file: SortMenu.vue:26 ~ newSortMenu:', newSortMenu.value)
const dragableWrapRef = ref()
</script>

<template>
  <ElButton type="primary" @click="openDialog">菜单排序</ElButton>
  <Dialog v-model="dialogVisible" title="拖动菜单排序">
    <div ref="dragableWrapRef">
      <div v-for="item in newSortMenu" :key="item.id">
        <div>
          {{ item.title }}
        </div>
      </div>
    </div>
  </Dialog>
</template>
