<script setup lang="ts">
import { reactive, unref } from 'vue'
import { Table, TableColumn } from '@/components/Table'
import { getMoneyLog } from '@/api/log'
import { Search } from '@/components/Search'
import { useTableXzz } from '@/hooks/web/useTableXzz'
import { FormSchema } from '@/components/Form'
import { formatToDateTime } from '@/utils/dateUtil'
import { useSearch } from '@/hooks/web/useSearch'

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
    field: 'SourceID',
    label: '操作人物ID',
    width: 80,
    align: 'center'
  },
  {
    field: 'TargetID',
    label: '目标人物ID',
    minWidth: 120
  },
  {
    field: 'Param',
    label: '参数',
    minWidth: 60
  },
  {
    field: 'Action',
    label: '动作类型',
    minWidth: 100
  },
  {
    field: 'Reason',
    label: '操作类型',
    minWidth: 120
  },
  {
    field: 'MoneyType',
    label: '货币类型',
    width: 100,
    align: 'center'
  },
  {
    field: 'MoneyCount',
    label: '数量'
  },
  {
    field: 'LogTime',
    label: '日志时间',
    minWidth: 180
  }
])

const { tableRegister, tableState, tableMethods } = useTableXzz({
  fetchDataApi: async () => {
    // 条件 查询
    const conditions = {
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams)
    }
    //  后端 获取表格 列表  数据
    const res = await getData(conditions)
    // 这里的数据 返回给hook  统一处理
    return {
      list: res?.list || [],
      total: res?.total || 0
    }
  }
})

const {
  dataList,
  loading,
  total,
  currentPage,
  pageSize,
  commonSearchSchema,
  searchParams,
  allEnumArr
} = tableState
const { getEnumValue, getEnumApi, setSearchParams } = tableMethods

// interface keyValue {
//   key: string
//   value: string
// }

const { searchRegister, searchMethods } = useSearch()
const { setSchema } = searchMethods

// const moneyTypeEnumObj: Ref<keyValue[]> = ref([])

// 向后端请求 需要 的 枚举数据    同时  生成 匹配枚举值的 新列表
const getData = async (conditions) => {
  const needEnum: string[] = ['Reason', 'MoneyType', 'Action']
  const enumArr: { itemName: string; data: any[] }[] = await getEnumApi('money', needEnum)
  allEnumArr.value = enumArr
  const tempdata = enumArr.filter((item) => item.itemName == 'MoneyType')
  let optionData: any[] = []
  if (tempdata) {
    optionData = tempdata[0].data.map((item) => {
      return {
        label: item.value,
        value: item.key
      }
    })
  }
  setSchema([
    {
      field: 'MoneyType',
      path: 'componentProps.options',
      // value: () => {
      //   // const options = optionData.map((item) => {
      //   //   return {
      //   //     label: item.value,
      //   //     value: item.key
      //   //   }
      //   // })
      //   // return options
      //   return [{ label: 'MoneyType', value: 'MoneyType' }]
      // }
      value: optionData
    }
  ])
  const res = await getMoneyLog(conditions)
  if (res && res.data && res.data?.list.length > 0) {
    const list = res.data.list.map((item) => {
      item.LogTime = formatToDateTime(item.LogTime)
      for (let i = 0; i < enumArr.length; i++) {
        const curItem = enumArr[i]['itemName']
        item[curItem] = getEnumValue(enumArr[i]['data'], item[curItem]) + '-' + item[curItem]
      }
      return item
    })
    return { list, total: res.data.total }
  }
}

// ==============搜索 逻辑================
const searchSchema1 = reactive<FormSchema[]>([
  {
    field: 'GroupID',
    label: '区服ID',
    component: 'Input'
  },
  {
    field: 'AreaID',
    label: '分组ID',
    component: 'Input'
  },
  {
    field: 'SourceID',
    label: '操作人物ID',
    component: 'Input'
  },
  {
    field: 'TargetID',
    label: '目标人物ID',
    component: 'Input'
  },
  {
    field: 'Param',
    label: '参数',
    component: 'Input'
  },
  {
    field: 'Action',
    label: '动作类型',
    component: 'Input'
  },
  {
    field: 'Reason',
    label: '操作类型',
    component: 'Input'
  },
  {
    field: 'MoneyType',
    label: '货币类型',
    component: 'Select'
  },
  {
    field: 'ItemCount',
    label: '数量',
    component: 'Input'
  }
])

//  合并公共搜索项
let searchSchema = reactive<FormSchema[]>([])
searchSchema = [...searchSchema1, ...commonSearchSchema]

//  用于 keep-alive 保持组件 缓存   则不需要pinia进行存储
defineOptions({
  // eslint-disable-next-line vue/component-definition-name-casing
  name: 'Tabletwo-xzz'
})
</script>

<template>
  <!-- 要注意的是  如果 使用的是模板代码  二次封装的组件   需要 单独引入一下 -->
  <Search
    :schema="searchSchema"
    @reset="setSearchParams"
    @search="setSearchParams"
    @register="searchRegister"
  />
  <Table
    v-model:pageSize="pageSize"
    v-model:current-page="currentPage"
    :columns="tableColumns"
    :data="dataList"
    :loading="loading"
    :pagination="{
      total
    }"
    @register="tableRegister"
  />
</template>
