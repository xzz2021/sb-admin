<template>
  <el-table :data="props.tableData" style="width: 40%">
    <el-table-column type="index" width="50" />
    <el-table-column prop="key" label="key" />
    <el-table-column prop="value" label="value" />
  </el-table>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
const props = defineProps({
  tableData: Array as () => any[]
})
</script>
