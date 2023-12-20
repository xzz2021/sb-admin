<script setup lang="ts">
import { Ref, onMounted, reactive, ref } from 'vue'
import { Table, TableColumn } from '@/components/Table'
import { getItemLog } from '@/api/log'
import { searchEnumitem } from '@/api/datascan'
import { useDatascanStore } from '@/store/modules/datascan'

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
const getData = async () => {
  const ActionType = await searchEnumitem({ enumName: 'item_ActionType' })
  console.log('🚀 ~ file: Tableone.vue:66 ~ getData ~ item_ActionType:')
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
    datascanStore.setItemlog(list)
    itemData.value = datascanStore.getItemlog
  }
}

const datascanStore = useDatascanStore()
onMounted(async () => {
  //  通过 存储数据到本地  节省 网络请求 开支
  const storeData = datascanStore.getItemlog
  storeData.length == 0 ? getData() : (itemData.value = datascanStore.getItemlog)
})

let itemData: Ref<any[]> = ref([])
</script>

<template>
  <el-text class="mx-1" type="danger">数据未同步?</el-text>
  <el-button type="primary" plain @click="getData" text>点我更新</el-button>
  <Table :columns="columns" :data="itemData" />
</template>
