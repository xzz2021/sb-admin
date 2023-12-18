<template>
  <el-table :data="props.tableData" style="width: 100%">
    <el-table-column type="index" width="50" />
    <el-table-column prop="key" label="key" width="260" />
    <el-table-column prop="value" label="value" width="160" />
  </el-table>
</template>

<script lang="ts" setup>
interface TableData {
  list: any[]
}
// import { reactive } from 'vue'
import { defineProps } from 'vue'
const props = defineProps({
  tableData: {
    list: Array,
    default: []
  }
})

// const tableData = reactive({ list: [] })
</script>
