<script setup lang="tsx">
import { Ref, reactive, ref } from 'vue'
import { Search } from '../../../components/Search'
import { Table, TableColumn } from '../../../components/Table'
import { useTableXzz } from './useTableXzz'

const tableColumns = reactive<TableColumn[]>([
  {
    field: 'username',
    label: '用户名',
    align: 'center'
  },
  {
    field: 'nickname',
    label: '昵称',
    align: 'center'
  },
  // {
  //   field: 'module',
  //   label: '操作模块',
  //   align: 'center'
  // },
  {
    field: 'ip',
    label: '请求ip',
    align: 'center'
  },
  {
    field: 'path',
    label: '请求接口',
    align: 'center'
  },
  {
    field: 'createTime',
    label: '操作时间',
    minWidth: 180
  }
])

const { tableRegister, tableState, tableMethods } = useTableXzz({
  fetchDataApi: async () => {
    // 条件 查询
    // const conditions = {
    //   pageIndex: unref(currentPage),
    //   pageSize: unref(pageSize),
    //   ...unref(searchParams)
    // }
    //  后端 获取表格 列表  数据
    // const res = await getLogData(conditions)
    const res = { list: [], total: 0 }
    // 这里的数据 返回给hook  统一处理
    return {
      list: res?.list || [],
      total: res?.total || 0
    }
  }
})

const searchSchema: Ref<[]> = ref([])

const { dataList, loading, total, currentPage, pageSize } = tableState
const { setSearchParams } = tableMethods

// 向后端请求 需要 的 枚举数据    同时  生成 匹配枚举值的 新列表

//  用于 keep-alive 保持组件 缓存   则不需要pinia进行存储
defineOptions({
  name: 'Log'
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
