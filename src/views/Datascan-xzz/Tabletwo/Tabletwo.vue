<script setup lang="ts">
import { Ref, onMounted, reactive, ref } from 'vue'
import { Table, TableColumn } from '@/components/Table'
import { getMoneyLog } from '@/api/log'
import { searchEnumitem } from '@/api/datascan'
// import { useDatascanStore } from '@/store/modules/datascan'
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

//  向后端请求 需要 的 枚举数据
const getEnumApi = async () => {
  const needEnum: string[] = ['Reason', 'MoneyType', 'Action']
  let searchArr: string[] = needEnum.map((item) => `money_${item}`)
  let enumArr: any[] = []
  const res = await searchEnumitem(searchArr)
  if (res && res.data && res.data.length > 0) {
    enumArr = res?.data.map((item) => {
      return {
        itemName: item.enumName.split('_')[1],
        data: item.itemJson
      }
    })
  }
  return enumArr
}
const getData = async () => {
  let enumArr: { itemName: string; data: any[] }[] = await getEnumApi()

  const res = await getMoneyLog()
  if (res.data && res.data.length > 0) {
    const list = res.data.map((item) => {
      for (let i = 0; i < enumArr.length; i++) {
        const curItem = enumArr[i]['itemName']
        item[curItem] = getEnumValue(enumArr[i]['data'], item[curItem])
      }
      return item
    })
    moneyData.value = list
  }
}

// const datascanStore = useDatascanStore()
onMounted(async () => {
  getData()
  //  通过 存储数据到本地  节省 网络请求 开支
  // const storeData = datascanStore.getMoneylog
  // storeData.length == 0 ? getData() : (moneyData.value = datascanStore.getMoneylog)
})

let moneyData: Ref<any[]> = ref([])

//  用于 keep-alive 保持组件 缓存   则不需要pinia进行存储
defineOptions({
  // 这里页面名称需与路由名称 一致  // 避免 eslint 告警  后续 一律 使用驼峰形式
  // eslint-disable-next-line vue/component-definition-name-casing
  name: 'Tabletwo-xzz'
})
</script>

<template>
  <el-text class="mx-1" type="danger">数据未同步?</el-text>
  <el-button type="primary" plain @click="getData" text>点我更新</el-button>
  <!-- <el-divider /> -->
  <Table :columns="columns" :data="moneyData" />
</template>
