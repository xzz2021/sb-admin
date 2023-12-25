<script setup lang="tsx">
import { Ref, onMounted, reactive, ref, unref } from 'vue'
// import { getItemLog } from '@/api/log'
// import { Search } from '@/components/Search'
// import { useTableXzz } from '@/hooks/web/useTableXzz'
// import { formatToDateTime } from '@/utils/dateUtil'
import { Table, TableColumn } from '../../../components/Table'
import { FormSchema } from '../../../components/Form'
import { getAllItems } from '../../../api/playeroperation'
import { ElButton, ElMessage, ElTag } from 'element-plus'

const tableColumns = reactive<TableColumn[]>([
  {
    field: 'content',
    label: '申请内容',
    // width: 170,
    align: 'center'
  },
  {
    field: 'applyRemark',
    label: '申请备注',
    // width: 70,
    align: 'center'
  },
  {
    field: 'applicant',
    label: '申请人',
    // width: 80,
    align: 'center'
  },
  //   {
  //     field: 'applyStatus',
  //     label: '申请状态',
  //     // width: 70,
  //     align: 'center'
  //   },
  {
    field: 'reviewStatus',
    label: '审批状态',
    // width: 80,
    align: 'center',
    slots: {
      default: (data: any) => {
        const reviewStatus = data.row.reviewStatus
        return (
          <el-text class="mx-1" type={reviewStatus == 1 ? 'success' : 'danger'}>
            {reviewStatus == 1 ? '已通过' : '已拒绝'}
          </el-text>
        )
      }
    }
  },
  {
    field: 'Guid',
    label: '审批意见'
    // minWidth: 100
  },
  {
    field: 'reviewer',
    label: '审批人'
    // minWidth: 120
  },
  {
    field: 'createtime',
    label: '申请时间'
    // minWidth: 140
  },
  {
    field: 'updatetime',
    label: '审批时间',
    // width: 160,
    align: 'center'
  }
])

const getData = async () => {
  const res = await getAllItems({ reviewStatus: 'all' })
  dataList.value = res.data
}
onMounted(() => {})
// const { tableRegister, tableState, tableMethods } = useTableXzz({
//   fetchDataApi: async () => {
//     // 条件 查询
//     const conditions = {
//       pageIndex: unref(currentPage),
//       pageSize: unref(pageSize),
//       ...unref(searchParams)
//     }
//     //  后端 获取表格 列表  数据
//     const res = await getData(conditions)
//     // 这里的数据 返回给hook  统一处理
//     return {
//       list: res?.list || [],
//       total: res?.total || 0
//     }
//   }
// })

// const {
//   dataList,
//   loading,
//   total,
//   currentPage,
//   pageSize,
//   commonSearchSchema,
//   searchParams,
//   allEnumArr
// } = tableState
// const { getEnumValue, getEnumApi, setSearchParams } = tableMethods

const dataList: Ref<any[]> = ref([])

// 向后端请求 需要 的 枚举数据    同时  生成 匹配枚举值的 新列表
// const getData = async (conditions) => {
//   const needEnum: string[] = ['Reason', 'TemplateID', 'ActionType', 'armor']
//   const enumArr: { itemName: string; data: any[] }[] = await getEnumApi('item', needEnum)
//   allEnumArr.value = enumArr
//   const tempData = enumArr.filter((item) => item.itemName == 'armor')
//   armorData.value = tempData[0].data
//   const res = await getItemLog(conditions)
//   if (res && res.data && res.data?.list.length > 0) {
//     const list = res.data.list.map((item) => {
//       item.LogTime = formatToDateTime(item.LogTime)
//       for (let i = 0; i < enumArr.length; i++) {
//         const curItem = enumArr[i]['itemName']
//         const tempName = getEnumValue(enumArr[i]['data'], item[curItem]) + '-' + item[curItem]
//         if (!/[\u4E00-\u9FA5]+/g.test(tempName)) {
//           item[curItem] = getEnumValue(armorData.value, item[curItem]) + '-' + item[curItem]
//         } else {
//           item[curItem] = tempName
//         }
//       }
//       return item
//     })
//     return { list, total: res.data.total }
//   }
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
  {
    field: 'ActionType',
    label: '动作类型',
    component: 'Input'
  },
  {
    field: 'Guid',
    label: '二进制索引',
    component: 'Input'
  },
  {
    field: 'TemplateID',
    label: '物品',
    component: 'Input'
  },
  {
    field: 'ItemCount',
    label: '数量',
    component: 'Input'
  },
  {
    field: 'Reason',
    label: '操作类型',
    component: 'Input'
  },
  {
    field: 'UserDefinedID',
    label: '定义ID',
    component: 'Input'
  }
])

//  合并公共搜索项
// let searchSchema = reactive<FormSchema[]>([])
// searchSchema = [...searchSchema1, ...commonSearchSchema]

//  用于 keep-alive 保持组件 缓存   则不需要pinia进行存储
// defineOptions({
//   // eslint-disable-next-line vue/component-definition-name-casing
//   name: 'Tableone-xzz'
// })
</script>

<template>
  <el-button type="primary" @click="getData">获取数据</el-button>
  <Table :columns="tableColumns" :data="dataList" />
  <!-- 要注意的是  如果 使用的是模板代码  二次封装的组件   需要 单独引入一下 -->
  <!-- <Search :schema="searchSchema" @reset="setSearchParams" @search="setSearchParams" /> -->
  <!-- <Table
    v-model:pageSize="pageSize"
    v-model:current-page="currentPage"
    :columns="tableColumns"
    :data="dataList"
    :loading="loading"
    :pagination="{
      total
    }"
    @register="tableRegister"
  /> -->
</template>
