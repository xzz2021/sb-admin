<script setup lang="ts">
import { Ref, reactive, ref, unref } from 'vue'
import { Table, TableColumn } from '@/components/Table'
import { getItemLog } from '@/api/log'
import { searchEnumitem } from '@/api/datascan'
// import { useDatascanStore } from '@/store/modules/datascan'
import { Search } from '@/components/Search'

import { useTableXzz } from '@/hooks/web/useTableXzz'
import { FormSchema } from '@/components/Form'
import { formatToDateTime } from '@/utils/dateUtil'

const tableColumns = reactive<TableColumn[]>([
  {
    field: 'ID',
    label: '序号',
    width: 60,
    align: 'center'
  },
  {
    field: 'GroupID',
    label: '区服ID',
    width: 70,
    align: 'center'
  },
  {
    field: 'AreaID',
    label: '分组ID',
    width: 70,
    align: 'center'
  },
  {
    field: 'RoleID',
    label: '角色ID',
    width: 80,
    align: 'center'
  },
  {
    field: 'ActionType',
    label: '动作类型',
    minWidth: 100
  },
  {
    field: 'Guid',
    label: '二进制索引',
    minWidth: 100
  },
  {
    field: 'TemplateID',
    label: '物品',
    minWidth: 140
  },
  {
    field: 'ItemCount',
    label: '数量',
    width: 60,
    align: 'center'
  },
  {
    field: 'Reason',
    label: '操作类型',
    minWidth: 100
  },
  {
    field: 'UserDefinedID',
    label: '定义ID',
    width: 70,
    align: 'center'
  },
  {
    field: 'LogTime',
    label: '日志时间',
    minWidth: 180
  }
])

// const { tableRegister, tableState, tableMethods } = useTableXzz({
const { tableRegister, tableState, tableMethods } = useTableXzz({
  fetchDataApi: async () => {
    // return {
    //   list: [],
    //   total: 100
    // }
    const res = await getData()
    // 这里的数据 返回给hook  统一处理
    return {
      list: res?.list || [],
      total: res?.total || 0
    }
  }
})

const { dataList, loading, total, currentPage, pageSize } = tableState
const { getList } = tableMethods

interface keyValue {
  key: string
  value: string
}
//  获取枚举  对应值
const getEnumValue = (enumType: keyValue[], value: string): string => {
  const enumItem = enumType.find((item) => item.key === value)
  return enumItem ? enumItem.value : value
}
const allEnumArr: Ref<any[]> = ref([])
const armorData: Ref<keyValue[]> = ref([])
//  向后端请求 需要 的 枚举数据
const getEnumApi = async () => {
  const needEnum: string[] = ['Reason', 'TemplateID', 'ActionType', 'armor']
  let searchArr: string[] = needEnum.map((item) => `item_${item}`)
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
  allEnumArr.value = enumArr
  const tempData = enumArr.filter((item) => item.itemName == 'armor')
  armorData.value = tempData[0].data
  return enumArr
}
// const getArmorData = async () => {
//   let tempData = await getEnumApi()
//   const armorData = tempData.filter((item) => item.itemName == 'armor')
//   return armorData[0].data
// }

//  反向获取英文value值
// const reverseKey = (findName, value) => {
//   const curItem = allEnumArr.value.filter((item) => item.itemName == `item_${findName}`)
//   if (curItem.length > 0) {
//     curItem[0].data
//   }
// }
//  获取英文对应键  的  中文value名
// const getEnumKeyValue = async () => {
//   return await getEnumApi()
// }
// 生成 匹配枚举值的 新列表
const getData = async () => {
  // console.log('🚀 ~ file: Tableone.vue:127 =========================logger.info():')
  const conditions = {
    pageIndex: unref(currentPage),
    pageSize: unref(pageSize),
    ...unref(searchParams)
  }
  // console.log('🚀 ~ file: Tableone.vue:133 ~ getData ~ conditions:', conditions)
  // return { list: [], total: 0 }
  const enumArr: { itemName: string; data: any[] }[] = await getEnumApi()
  // try {
  //   loading.value = true
  // console.log('🚀 ~ file: Tableone.vue:135 ~ getData ~ res3:', res3)
  const res = await getItemLog(conditions)
  if (res && res.data && res.data?.list.length > 0) {
    const list = res.data.list.map((item) => {
      item.LogTime = formatToDateTime(item.LogTime)
      for (let i = 0; i < enumArr.length; i++) {
        const curItem = enumArr[i]['itemName']
        if (curItem == 'TemplateID') {
          const tempName = getEnumValue(enumArr[i]['data'], item[curItem]) + '-' + item[curItem]
          if (!/[\u4E00-\u9FA5]+/g.test(tempName)) {
            item[curItem] = getEnumValue(armorData.value, item[curItem]) + '-' + item[curItem]
          } else {
            item[curItem] = tempName
          }
        } else {
          item[curItem] = getEnumValue(enumArr[i]['data'], item[curItem])
        }
      }
      return item
    })
    return { list, total: res.data.total }
  }
  // } catch (error) {
  // } finally {
  //   loading.value = false
  // }
}

const shortcuts = [
  {
    text: '上周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '上个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: '前3个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }
]
const defaultTime: [Date, Date] = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]
// ==============搜索 逻辑================
const searchSchema = reactive<FormSchema[]>([
  {
    field: 'RoleID',
    label: '角色ID',
    component: 'Input'
  },
  {
    field: 'ActionType',
    label: '动作类型',
    component: 'Input'
  },
  {
    field: 'TemplateID',
    label: '物品',
    component: 'Input'
  },
  {
    field: 'Reason',
    label: '操作类型',
    component: 'Input'
  },
  // {
  //   field: 'LogTime',
  //   label: '日志时间',
  //   component: 'DatePicker',
  //   componentProps: {
  //     'value-format': 'YYYY-MM-DD'
  //   }
  // }
  {
    field: 'LogTime',
    label: '日志时间',
    component: 'DatePicker',
    componentProps: {
      type: 'datetimerange',
      'unlink-panels': true,
      'range-separator': '至',
      'start-placeholder': '开始日期',
      'end-placeholder': '结束日期',
      shortcuts: shortcuts,
      'default-time': defaultTime
    }
  }
])

//  获取枚举  原本的值   即反取
const getRawEnumValue = (enumType: keyValue[], value: string): string => {
  const enumItem = enumType.find((item) => item.value === value)
  return enumItem ? enumItem.key : value
}

//  移除 对象内部 指定键名  的键值 数据
const omit = (obj, keys) =>
  Object.keys(obj)
    .filter((k) => !keys.includes(k))
    .reduce((res, k) => Object.assign(res, { [k]: obj[k] }), {})
//       searchParam = omit(searchParam,['LogTime'])
const searchParams = ref({})
const setSearchParams = (data: any) => {
  console.log('🚀 ~ file: Tableone.vue:268 ~ setSearchParams ~ data:', data)
  //  如果 时间区间 条件 存在
  let LogTimeValue: string[] = []
  if (data.LogTime) {
    LogTimeValue = [formatToDateTime(data.LogTime[0]), formatToDateTime(data.LogTime[1])]
    data = omit(data, ['LogTime'])
  }
  // allEnumArr
  // if (data.ActionType) {
  //   const rawKeyValueArr = allEnumArr.value.find((item) => item.itemName === 'ActionType')
  //   data.ActionType = getRawEnumValue(rawKeyValueArr?.data, data.ActionType)
  // }
  Object.keys(data).forEach(function (key) {
    if (/[\u4E00-\u9FA5]+/g.test(data[key])) {
      const rawKeyValueArr = allEnumArr.value.find((item) => item.itemName == key)
      data[key] = getRawEnumValue(rawKeyValueArr?.data, data[key])
    }
  })
  if (LogTimeValue.length > 0) {
    searchParams.value = { ...data, ...{ LogTime: LogTimeValue } }
  } else {
    searchParams.value = data
  }
  getList()
}

//=========================

// onMounted(async () => {
// })

//  用于 keep-alive 保持组件 缓存   则不需要pinia进行存储
defineOptions({
  // eslint-disable-next-line vue/component-definition-name-casing
  name: 'Tableone-xzz'
})

// const getData1 = () => {
//   console.log('################################')
// }
</script>

<template>
  <!-- 要注意的是  如果 使用的是模板代码  二次封装的组件   需要 单独引入一下 -->
  <Search :schema="searchSchema" @reset="setSearchParams" @search="setSearchParams" />

  <el-text class="mx-1" type="danger">数据未同步?</el-text>
  <el-button type="primary" plain @click="getList" text>点我更新</el-button>
  <Table
    v-model:pageSize="pageSize"
    :columns="tableColumns"
    :data="dataList"
    :loading="loading"
    :pagination="{
      total
    }"
    @register="tableRegister"
  />
</template>
