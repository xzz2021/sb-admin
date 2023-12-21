<script setup lang="ts">
import { Ref, reactive, ref } from 'vue'
import { Table, TableColumn } from '@/components/Table'
import { getItemLog } from '@/api/log'
import { searchEnumitem } from '@/api/datascan'
// import { useDatascanStore } from '@/store/modules/datascan'
import { Search } from '@/components/Search'

import { useTableXzz } from '@/hooks/web/useTableXzz'
import { FormSchema } from '@/components/Form'

const tableColumns = reactive<TableColumn[]>([
  {
    field: 'ID',
    label: '序号'
    // width: 20
    // componentProps: {
    //   width: '10%'
    // }
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
    label: '物品'
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

// const { tableRegister, tableState, tableMethods } = useTableXzz({
const { tableRegister, tableState, tableMethods } = useTableXzz({
  fetchDataApi: async () => {
    const res = await getData()
    // 这里的数据 返回给hook  统一处理
    return {
      list: res?.list || [],
      total: res?.list.length || 0
    }
  }
})

const { dataList, loading, total } = tableState
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
  const tempData = enumArr.filter((item) => item.itemName == 'armor')
  armorData.value = tempData[0].data
  return enumArr
}
// const getArmorData = async () => {
//   let tempData = await getEnumApi()
//   const armorData = tempData.filter((item) => item.itemName == 'armor')
//   return armorData[0].data
// }

// 生成 匹配枚举值的 新列表

const getData = async () => {
  const enumArr: { itemName: string; data: any[] }[] = await getEnumApi()
  const res = await getItemLog()
  if (res.data && res.data.length > 0) {
    const list = res.data.map((item) => {
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
    return { list }
  }
}

// ==============搜索 逻辑================
const searchSchema = reactive<FormSchema[]>([
  {
    field: 'ActionType',
    label: '动作类型',
    component: 'Input'
  },
  {
    field: 'Reason',
    label: '操作类型',
    component: 'Input'
  },
  {
    field: 'LogTime',
    label: '日志时间',
    component: 'DatePicker',
    componentProps: {
      'value-format': 'YYYY-MM-DD'
    }
  }
])

const searchParams = ref({})
const setSearchParams = (data: any) => {
  console.log('🚀 ~ file: Tableone.vue:125 ~ setSearchParams ~ data:', data)
  searchParams.value = data
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
</script>

<template>
  <!-- 要注意的是  如果 使用的是模板代码  二次封装的组件   需要 单独引入一下 -->
  <Search :schema="searchSchema" @reset="setSearchParams" @search="setSearchParams" />

  <el-text class="mx-1" type="danger">数据未同步?</el-text>
  <el-button type="primary" plain @click="getData" text>点我更新</el-button>
  <Table
    :columns="tableColumns"
    :data="dataList"
    :loading="loading"
    :pagination="{
      total
    }"
    @register="tableRegister"
  />
</template>
