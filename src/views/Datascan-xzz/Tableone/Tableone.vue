<script setup lang="tsx">
import { Ref, reactive, ref, unref } from 'vue'
import { Table, TableColumn } from '@/components/Table'
import { getItemLog } from '@/api/log'
import { Search } from '@/components/Search'
import { useTableXzz } from '@/hooks/web/useTableXzz'
import { FormSchema } from '@/components/Form'
import { formatToDateTime } from '@/utils/dateUtil'
// import { ElSelect, ElOption } from 'element-plus'

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
    minWidth: 120
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
    minWidth: 120
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
const { getEnumValue, setSearchParams, getAllEnumArr, getEachOptions } = tableMethods

interface keyValue {
  key: string
  value: string
}

const armorData: Ref<keyValue[]> = ref([])

// 向后端请求 需要 的 枚举数据    同时  生成 匹配枚举值的 新列表
const getData = async (conditions) => {
  const needEnum: string[] = ['Reason', 'TemplateID', 'ActionType', 'armor']
  allEnumArr.value.length || (allEnumArr.value = await getAllEnumArr('item', needEnum))
  const enumArr = allEnumArr.value
  const tempData = enumArr.filter((item) => item.itemName == 'armor')
  armorData.value = tempData[0].data
  const res = await getItemLog(conditions)
  if (res && res.data && res.data?.list.length > 0) {
    const list = res.data.list.map((item) => {
      item.LogTime = formatToDateTime(item.LogTime)
      for (let i = 0; i < enumArr.length; i++) {
        const curItem = enumArr[i]['itemName']
        const tempName = getEnumValue(enumArr[i]['data'], item[curItem]) + '-' + item[curItem]
        if (!/[\u4E00-\u9FA5]+/g.test(tempName)) {
          item[curItem] = getEnumValue(armorData.value, item[curItem]) + '-' + item[curItem]
        } else {
          item[curItem] = tempName
        }
      }
      return item
    })
    return { list, total: res.data.total }
  }
}

// const remoteMethod = (query: string) => {
//   if (query) {
//       options.value = list.value.filter((item) => {
//         return item.label.toLowerCase().includes(query.toLowerCase())
//       }
//   } else {
//     options.value = []
//   }
// }
// const allOptions: Ref<any> = ref([])
// const getAllOptions = (enumArr) => {
//   const optionItem = enumArr.find((item) => item.itemName == 'ActionType')
//   allOptions.value = optionItem?.data.map((item) => {
//     return {
//       // label: item.value + '-' + item.key,
//       label: item.value,
//       value: item.value
//     }
//   })
// }

// const getEachOptions = (type) => {
//   const options = allEnumArr.value.find((item) => item.itemName == type)
//   return options?.data.map((item, _index) => {
//     return {
//       label: item.value + '-' + item.key,
//       value: item.value
//     }
//   })
// }
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
    field: 'RoleID',
    label: '角色ID',
    component: 'Input'
  },
  // {
  //   field: 'ActionType',
  //   label: '动作类型',
  //   component: 'Select',
  //   componentProps: {
  //     // placeholder: '请输入关键词进行搜索',
  //     // filterable: true,
  //     // remote: true
  //     on: {
  //       change: (_val) => {
  //         console.log('🚀 ~ file: Tableone.vue:199 ~ _val:', _val)
  //         // const instance = getCurrentInstance()
  //         // const $forceUpdate = () => queuePostFlushCb(instance?.update)
  //         // $forceUpdate()
  //       }
  //     }
  //   },
  //   formItemProps: {
  //     slots: {
  //       default: (_data: any) => {
  //         // console.log('🚀 ~ file: Tableone.vue:181 ~ data:', data)
  //         return (
  //           <>
  //             <ElSelect
  //               filterable
  //               remote
  //               model-value={selectedVal}
  //               reserve-keyword
  //               placeholder="请输入关键词进行搜索"
  //               remote-method={(query) => {
  //                 if (query) {
  //                   currentOptions.value = allOptions.value.filter((item) => {
  //                     if (/\p{Script=Han}/u.test(query)) {
  //                       // 判断是否包含中文
  //                       return item.label.includes(query)
  //                     } else {
  //                       return item.label.toLowerCase().includes(query.toLowerCase())
  //                     }
  //                   })
  //                 } else {
  //                   currentOptions.value = []
  //                 }
  //               }}
  //             >
  //               {currentOptions.value.map((element, index2) => {
  //                 return <ElOption label={element.label} value={element.value} key={index2} />
  //               })}
  //             </ElSelect>
  //           </>
  //         )
  //       }
  //     }
  //   }
  //   // optionApi: () => {
  //   //   const options = allEnumArr.value.find((item) => item.itemName == 'ActionType')
  //   //   return options?.data.map((item, index) => {
  //   //     return {
  //   //       label: item.value,
  //   //       value: item.value,
  //   //       key: index
  //   //     }
  //   //   })
  //   // }
  // },
  {
    field: 'ActionType',
    label: '动作类型',
    component: 'Select',
    componentProps: {
      placeholder: '可以输入关键词进行搜索',
      filterable: true
      // remote: true
    },
    optionApi: () => getEachOptions('ActionType')
  },
  {
    field: 'Guid',
    label: '二进制索引',
    component: 'Input'
  },
  {
    field: 'TemplateID',
    label: '物品',
    component: 'Select',
    componentProps: {
      placeholder: '可以输入关键词进行搜索',
      filterable: true
      // remote: true
    },
    optionApi: () => getEachOptions('TemplateID')
  },
  {
    field: 'ItemCount',
    label: '数量',
    component: 'Input'
  },
  {
    field: 'Reason',
    label: '操作类型',
    component: 'Select',
    componentProps: {
      placeholder: '可以输入关键词进行搜索',
      filterable: true
      // remote: true
    },
    optionApi: () => getEachOptions('Reason')
  },
  {
    field: 'UserDefinedID',
    label: '定义ID',
    component: 'Input'
  }
])

//  合并公共搜索项
let searchSchema = reactive<FormSchema[]>([])
searchSchema = [...searchSchema1, ...commonSearchSchema]

//  用于 keep-alive 保持组件 缓存   则不需要pinia进行存储
defineOptions({
  // eslint-disable-next-line vue/component-definition-name-casing
  name: 'Tableone-xzz'
})
</script>

<template>
  <!-- 要注意的是  如果 使用的是模板代码  二次封装的组件   需要 单独引入一下 -->
  <Search :schema="searchSchema" @reset="setSearchParams" @search="setSearchParams" />
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
