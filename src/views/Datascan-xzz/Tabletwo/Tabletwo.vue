<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Table, TableColumn } from '@/components/Table'
import { getMoneyLog } from '@/api/log'
const columns = reactive<TableColumn[]>([
  {
    field: 'ID',
    label: '序号'
  },
  {
    field: 'LogTime',
    label: '日志时间'
  },
  {
    field: 'GroupID',
    label: '区服ID'
  },
  {
    field: 'AreaID',
    label: '分组ID'
  },
  {
    field: 'SourceID',
    label: '操作人物ID'
  },
  {
    field: 'TargetID',
    label: '目标人物ID'
  },
  {
    field: 'Param',
    label: '参数'
  },
  {
    field: 'Action',
    label: '动作类型'
  },
  {
    field: 'Reason',
    label: '操作类型'
  },
  {
    field: 'MoneyType',
    label: '货币类型'
  },
  {
    field: 'MoneyCount',
    label: '数量'
  }
])
onMounted(async () => {
  const res = await getMoneyLog()
  console.log('🚀 ~ file: Tableone.vue:53 ~ onMounted ~ res:', res)
  if (res.data) {
    data.value = res.data
  }
})

let data = ref([])
</script>

<template>
  <Table :columns="columns" :data="data" />
</template>
