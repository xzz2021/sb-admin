<script setup lang="ts">
import { Ref, onMounted, reactive, ref } from 'vue'
import { Table, TableColumn } from '@/components/Table'
import { getMoneyLog } from '@/api/log'
import { searchEnumitem } from '@/api/datascan'
import { useDatascanStore } from '@/store/modules/datascan'
import { ElButton } from 'element-plus'
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

const getData = async () => {
  const ActionType = await searchEnumitem({ enumName: 'money_ActionType' })
  const ReasonType = await searchEnumitem({ enumName: 'money_Reason' })
  const ActionEnum = ActionType?.data?.itemJson || []
  const ReasonEnum = ReasonType.data.itemJson || []
  const res = await getMoneyLog()
  if (res.data && res.data.length > 0) {
    const list = res.data.map((item) => {
      item.ActionType = getEnumValue(ActionEnum, item.ActionType)
      item.Reason = getEnumValue(ReasonEnum, item.Reason)
      return item
    })
    datascanStore.setMoneylog(list)
    moneyData.value = datascanStore.getMoneylog
  }
}

const datascanStore = useDatascanStore()
onMounted(async () => {
  //  通过 存储数据到本地  节省 网络请求 开支
  const storeData = datascanStore.getMoneylog
  storeData.length == 0 ? getData() : (moneyData.value = datascanStore.getMoneylog)
})

let moneyData: Ref<any[]> = ref([])
</script>

<template>
  <el-text class="mx-1" type="danger">数据未同步?</el-text>
  <el-button type="primary" plain @click="getData" text>点我更新</el-button>
  <!-- <el-divider /> -->
  <Table :columns="columns" :data="moneyData" />
</template>
