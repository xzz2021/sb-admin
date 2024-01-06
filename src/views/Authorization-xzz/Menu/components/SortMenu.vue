<script setup lang="ts">
import { usePermissionStore } from '@/store/modules/permission'
import { ref } from 'vue'
import { Dialog } from '@/components/Dialog'
// import { useDraggable, type UseDraggableReturn } from 'vue-draggable-plus'
import { useDraggable } from 'vue-draggable-plus'
import { updateSortMenuApi } from '@/api/menu'
import { updateMenu } from '@/utils/menu'

const permissionStore = usePermissionStore()
const sortMenu = permissionStore.getSortMenu
const dialogVisible = ref(false)

const openDialog = () => {
  dialogVisible.value = true
  // dialog实例必须在打开后才能挂载
  useDraggable(dragableWrapRef, newSortMenu, {
    animation: 150,
    ghostClass: 'ghost'
    // onStart() {
    //   console.log('start')
    // },
    // onUpdate() {
    //   console.log('update')
    // }
  })
}

const cancel = () => {
  dialogVisible.value = false
  newSortMenu.value = sortMenu
}

const confirm = async () => {
  let ll = newSortMenu.value.length
  for (let i = 0; i < ll; i++) {
    newSortMenu.value[i].sort = i
  }
  try {
    const res = await updateSortMenuApi(newSortMenu.value)
    if (res && res.data) {
      updateMenu()
    } else {
    }
  } catch (error) {
    console.log('🚀 ~ file: SortMenu.vue:45 ~ confirm ~ error:', error)
  }
  dialogVisible.value = false
}
const newSortMenu = ref(sortMenu)
const dragableWrapRef = ref()
</script>

<template>
  <ElButton type="success" @click="openDialog">菜单排序</ElButton>
  <Dialog
    v-model="dialogVisible"
    title="拖动菜单排序"
    maxHeight="900"
    center
    width="500px"
    @closed="cancel"
  >
    <div ref="dragableWrapRef" style="text-align: -webkit-center">
      <div v-for="item in newSortMenu" :key="item.id" class="eachDiv">
        {{ item.title }}
      </div>
    </div>
    <template #footer>
      <ElButton @click="cancel">取消</ElButton>
      <ElButton @click="confirm" type="primary">确定提交</ElButton>
    </template>
  </Dialog>
</template>
<style scoped>
.eachDiv {
  width: 350px;
  height: 40px;
  border-radius: 5px;
  line-height: 40px;
  text-align: center;
  /* border: 1px solid aqua; */
  background: #80808057;
  margin: 10px;
}
.eachDiv:hover {
  cursor: grab;
}
.eachDiv:target {
  cursor: grabbing;
}
</style>
