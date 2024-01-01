import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableExpose, TableProps, TableSetProps, TableColumn } from '@/components/Table'
import { ElTable, ElMessageBox, ElMessage } from 'element-plus'
import { ref, watch, unref, nextTick, onMounted, reactive, Ref } from 'vue'
import { searchEnumitem } from '@/api/datascan'
import { FormSchema } from '@/components/Form'
import { formatToDateTime } from '@/utils/dateUtil'
import { isString } from 'lodash-es'

const { t } = useI18n()

interface UseTableConfig {
  /**
   * 是否初始化的时候请求一次
   */
  immediate?: boolean
  fetchDataApi: () => Promise<{
    // data?: any
    list?: any[]
    total?: number
  }>
  fetchDelApi?: () => Promise<boolean>
}

interface keyValue {
  key: string
  value: string
}

export const useTableXzz = (config: UseTableConfig) => {
  const { immediate = true } = config

  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(0)
  const dataList = ref<any[]>([])
  //  日期查询结构 预设值
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
  //  日期组件 默认 时间 区间  设置
  const defaultTime: [Date, Date] = [
    new Date(2000, 1, 1, 0, 0, 0),
    new Date(2000, 2, 1, 23, 59, 59)
  ]
  //  公共搜索项目
  const commonSearchSchema = reactive<FormSchema[]>([
    // {
    //   field: 'Reason',
    //   label: '操作类型',
    //   component: 'Input'
    // },
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
        // labelWidth: '100px',
        // inline: false
      }
    }
  ])

  const searchParams = ref({})

  const allEnumArr: Ref<{ data: any[]; itemName: string }[]> = ref([])

  watch(
    () => currentPage.value,
    () => {
      methods.getList()
    }
  )

  watch(
    () => pageSize.value,
    () => {
      // 当前页不为1时，修改页数后会导致多次调用getList方法
      if (unref(currentPage) === 1) {
        methods.getList()
      } else {
        currentPage.value = 1
        methods.getList()
      }
    }
  )

  onMounted(() => {
    if (immediate) {
      methods.getList()
    }
  })

  // Table实例
  const tableRef = ref<typeof Table & TableExpose>()

  // ElTable实例
  const elTableRef = ref<ComponentRef<typeof ElTable>>()

  const register = (ref: typeof Table & TableExpose, elRef: ComponentRef<typeof ElTable>) => {
    tableRef.value = ref
    elTableRef.value = unref(elRef)
  }

  const getTable = async () => {
    await nextTick()
    const table = unref(tableRef)
    if (!table) {
      console.error('The table is not registered. Please use the register method to register')
    }
    return table
  }

  const methods = {
    /**
     * 获取表单数据
     */
    getList: async () => {
      loading.value = true
      try {
        const res = await config?.fetchDataApi()
        // //  在这里可以 直接生成 一次 嵌套数据  就可以了
        if (res) {
          dataList.value = res.list || []
          total.value = res.total || 0
        }
      } catch (err) {
        console.log('fetchDataApi error')
      } finally {
        loading.value = false
      }
    },

    /**
     * @description 设置table组件的props
     * @param props table组件的props
     */
    setProps: async (props: TableProps = {}) => {
      const table = await getTable()
      table?.setProps(props)
    },

    /**
     * @description 设置column
     * @param columnProps 需要设置的列
     */
    setColumn: async (columnProps: TableSetProps[]) => {
      const table = await getTable()
      table?.setColumn(columnProps)
    },

    /**
     * @description 新增column
     * @param tableColumn 需要新增数据
     * @param index 在哪里新增
     */
    addColumn: async (tableColumn: TableColumn, index?: number) => {
      const table = await getTable()
      table?.addColumn(tableColumn, index)
    },

    /**
     * @description 删除column
     * @param field 删除哪个数据
     */
    delColumn: async (field: string) => {
      const table = await getTable()
      table?.delColumn(field)
    },

    /**
     * @description 获取ElTable组件的实例
     * @returns ElTable instance
     */
    getElTableExpose: async () => {
      await getTable()
      return unref(elTableRef)
    },

    refresh: () => {
      methods.getList()
    },

    // sortableChange: (e: any) => {
    //   console.log('sortableChange', e)
    //   const { oldIndex, newIndex } = e
    //   dataList.value.splice(newIndex, 0, dataList.value.splice(oldIndex, 1)[0])
    //   // to do something
    // }
    // 删除数据
    delList: async (idsLength: number) => {
      const { fetchDelApi } = config
      if (!fetchDelApi) {
        console.warn('fetchDelApi is undefined')
        return
      }
      ElMessageBox.confirm(t('common.delMessage'), t('common.delWarning'), {
        confirmButtonText: t('common.delOk'),
        cancelButtonText: t('common.delCancel'),
        type: 'warning'
      }).then(async () => {
        const res = await fetchDelApi()
        if (res) {
          ElMessage.success(t('common.delSuccess'))

          // 计算出临界点
          const current =
            unref(total) % unref(pageSize) === idsLength || unref(pageSize) === 1
              ? unref(currentPage) > 1
                ? unref(currentPage) - 1
                : unref(currentPage)
              : unref(currentPage)
          currentPage.value = current
          methods.getList()
        }
      })
    },
    //  获取枚举  对应中文值
    getEnumValue: (enumType: keyValue[], value: string): string => {
      const enumItem = enumType.find((item) => item.key === value)
      return enumItem ? enumItem.value : value
    },
    //  获取枚举  原本的值   即通过中文反取 对应 英文
    getRawEnumValue: (enumType: keyValue[], value: string): string => {
      const enumItem = enumType.find((item) => item.value === value)
      return enumItem ? enumItem.key : value
    },
    //  移除 对象内部 指定键名  的键值 数据
    omit: (obj, keys) =>
      Object.keys(obj)
        .filter((k) => !keys.includes(k))
        .reduce((res, k) => Object.assign(res, { [k]: obj[k] }), {}),
    //  向后端请求 需要 的 枚举数据
    getEnumApi: async (logType: string, needEnum: string[]) => {
      if (logType.length === 0) return []
      const searchArr: string[] = needEnum.map((item) => `${logType}_${item}`)
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
    },
    setSearchParams: (data: any) => {
      // return
      //  如果 时间区间 条件 存在
      let LogTimeValue: string[] = []
      if (data.LogTime) {
        LogTimeValue = [formatToDateTime(data.LogTime[0]), formatToDateTime(data.LogTime[1])]
        data = methods.omit(data, ['LogTime'])
      }
      Object.keys(data).forEach(function (key) {
        isString(data[key]) && (data[key] = data[key].trim()) // 去除查询字段  误输入的 空格
        if (/[\u4E00-\u9FA5]+/g.test(data[key])) {
          //  如果  复制时 同时包含了 中文-以及后面的英文value  只取中文
          if (data[key].includes('-')) data[key] = data[key].split('-')[0]
          const rawKeyValueObj = allEnumArr.value.find((item) => item.itemName == key)
          //  如果枚举项 存在   则提取对应键  中文 value
          rawKeyValueObj && (data[key] = methods.getRawEnumValue(rawKeyValueObj?.data, data[key]))
        }
      })
      if (LogTimeValue.length > 0) {
        searchParams.value = { ...data, ...{ LogTime: LogTimeValue } }
      } else {
        searchParams.value = data
      }
      methods.getList()
    },
    //  获取当前项目所需的 所有 枚举值
    getAllEnumArr: async (logtype: string, needEnum: string[]) => {
      // const needEnum: string[] = ['Reason', 'TemplateID', 'ActionType', 'armor']
      const enumArr: { itemName: string; data: any[] }[] = await methods.getEnumApi(
        logtype,
        needEnum
      )
      return enumArr
    },
    //  分别获取对应的下拉 搜索options
    getEachOptions: (type) => {
      const options = allEnumArr.value.find((item) => item.itemName == type)
      return options?.data.map((item, _index) => {
        return {
          label: item.value + '-' + item.key,
          value: item.value
        }
      })
    }
  }

  return {
    tableRegister: register,
    tableMethods: methods,
    tableState: {
      currentPage,
      pageSize,
      total,
      dataList,
      loading,
      // shortcuts,
      // defaultTime,
      commonSearchSchema,
      searchParams,
      allEnumArr
    }
  }
}
