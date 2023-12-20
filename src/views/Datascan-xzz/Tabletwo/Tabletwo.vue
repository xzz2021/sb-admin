<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Table, TableColumn } from '@/components/Table'
import { getMoneyLog } from '@/api/log'
import { searchEnumitem } from '@/api/datascan'
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
const getEnumValue = (enumType: any[], value: string): string => {
  const enumItem = enumType.find((item) => item.key === value)
  return enumItem ? enumItem.value : value
}
onMounted(async () => {
  const ActionType = await searchEnumitem({ enumName: 'money_ActionType' })
  const ReasonType = await searchEnumitem({ enumName: 'money_Reason' })
  const ActionEnum = ActionType?.data?.itemJson || []
  const ReasonEnum = ReasonType.data.itemJson || []
  const res = await getMoneyLog()

  if (res.data && res.data.length > 0) {
    const list = res.data.map((item) => {
      item.Reason = getEnumValue(ReasonEnum, item.Reason)
      item.Action = getEnumValue(ActionEnum, item.Action)
      return item
    })
    data.value = list
  }
})

let data = ref([])
</script>

<template>
  <Table :columns="columns" :data="data" />
</template>
