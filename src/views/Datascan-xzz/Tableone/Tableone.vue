<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Table, TableColumn } from '@/components/Table'
import { getItemLog } from '@/api/log'
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
    field: 'RoleID',
    label: '角色ID'
  },
  {
    field: 'ActionType',
    label: '动作类型'
  },
  {
    field: 'Guid',
    label: '二进制索引'
  },
  {
    field: 'TemplateID',
    label: '物品ID'
  },
  {
    field: 'ItemCount',
    label: '数量'
  },
  {
    field: 'Reason',
    label: '操作类型'
  },
  {
    field: 'UserDefinedID',
    label: '定义ID'
  }
])

interface keyValue {
  key: string
  value: string
}
//  获取枚举  对应值
const getEnumValue = (enumType: keyValue[], value: string): string => {
  const enumItem = enumType.find((item) => item.key === value)
  return enumItem ? enumItem.value : value
}
onMounted(async () => {
  const ActionType = await searchEnumitem({ enumName: 'item_ActionType' })
  const ReasonType = await searchEnumitem({ enumName: 'item_Reason' })
  const ActionEnum = ActionType?.data?.itemJson || []
  const ReasonEnum = ReasonType.data.itemJson || []
  const res = await getItemLog()
  if (res.data && res.data.length > 0) {
    const list = res.data.map((item) => {
      item.ActionType = getEnumValue(ActionEnum, item.ActionType)
      item.Reason = getEnumValue(ReasonEnum, item.Reason)
      return item
    })
    data.value = list
    console.log('🚀 ~ file: Tableone.vue:74 ~ onMounted ~ list:', list)
  }
})

let data = ref([])
</script>

<template>
  <Table :columns="columns" :data="data" />
</template>
