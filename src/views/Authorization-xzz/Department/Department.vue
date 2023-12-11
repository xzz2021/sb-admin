<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElMessage, ElTag } from 'element-plus'
import { Table } from '@/components/Table'
import {
  getDepartmentApi,
  getDepartmentTableApi,
  saveDepartmentApi,
  deleteDepartmentApi,
  batchDeleteDepartmentApi
} from '@/api/department'
import type { DepartmentItem } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import { ref, unref, reactive } from 'vue'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'

const ids = ref<string[]>([])

// 递归生成部门嵌套数组数据
const getNestedArray: (arr: any[], pid: string) => any[] = (arr, pid = '1000') => {
  // 创建一个空数组来保存嵌套的父子关系
  var nestedArr: any[] = []
  arr.map((item) => (item.value = item.id))
  // console.log('🚀 ~ file: Department.vue:29 ~ arr:', arr)
  // let id = arr['id']
  // console.log('🚀 ~ file: Department.vue:28 ~ id:', id)
  // arr['value'] = arr['id']
  // 遍历数组中的每个元素
  for (var i = 0; i < arr.length; i++) {
    // 如果当前元素的pid等于给定的pid，则它是父节点
    if (arr[i].pid === pid) {
      // 使用递归调用辅助函数来查找子节点，并将它们添加到父节点的children属性中
      arr[i].children = getNestedArray(arr, arr[i].id)
      // 将当前父节点添加到嵌套数组中
      nestedArr.push(arr[i])
    }
  }
  // 返回嵌套的父子关系数组
  return nestedArr
}

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    //此处用于表格展示数据
    const { currentPage, pageSize } = tableState
    const res = await getDepartmentTableApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams)
    })
    // console.log('🚀 ~ file: Department.vue:31 ~ fetchDataApi: ~ res:', res)
    // return {
    //   list: res.data.list,
    //   total: res.data.total
    // }

    let newList = getNestedArray(res.data, '1000')
    // console.log('🚀 ~ file: Department.vue:137 ~ optionApi: ~ newList:', newList)

    return {
      list: newList,
      total: newList.length
    }
  },
  fetchDelApi: async () => {
    const res = await deleteDepartmentApi(unref(ids))
    return !!res
    // return null
  }
})

const { getElTableExpose } = tableMethods

const { loading, dataList, total, currentPage, pageSize } = tableState
// const { getList, getElTableExpose, delList } = tableMethods
const { getList } = tableMethods

const searchParams = ref({})
const setSearchParams = (params: any) => {
  searchParams.value = params
  getList()
}

const { t } = useI18n()

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'selection',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      type: 'selection'
    }
  },
  {
    field: 'index',
    label: t('tableDemo.index'),
    type: 'index',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    }
  },
  {
    // 用于新增部门的上级部门 录入表单
    field: 'pid',
    // label: t('tableDemo.index'),
    label: '上级部门',
    table: {
      hidden: true,
      slots: {
        default: (data: any) => {
          return <>{data.row.id}</>
        }
      }
    },
    form: {
      // hidden: true,
      component: 'TreeSelect',
      componentProps: {
        renderAfterExpand: true,
        // nodeKey: 'id',
        // showCheckbox: true,
        checkStrictly: true,
        checkOnClickNode: true,
        props: {
          label: 'departmentName'
        }
      },
      optionApi: async () => {
        //此处用于表单输入数据获取
        const res = await getDepartmentApi()
        // return list
        const newList = getNestedArray(res.data, '1000')
        return newList
      }
    }
  },
  {
    field: 'departmentName',
    label: t('userDemo.departmentName'),
    table: {
      slots: {
        default: (data: any) => {
          return <>{data.row.departmentName}</>
        }
      }
    },
    // form: {
    //   component: 'TreeSelect',
    //   componentProps: {
    //     nodeKey: 'id',
    //     props: {
    //       label: 'departmentName'
    //     }
    //   },
    //   optionApi: async () => {
    //     const res = await getDepartmentApi()
    //     return res.data.list
    //   }
    // },
    form: {
      hidden: true,
      component: 'TreeSelect',
      componentProps: {
        renderAfterExpand: true,
        // nodeKey: 'id',
        // showCheckbox: true,
        checkStrictly: true,
        checkOnClickNode: true,
        props: {
          label: 'departmentName'
        }
      },
      optionApi: async () => {
        //此处用于表单输入数据获取
        const res = await getDepartmentApi()
        const list: any[] = res.data
        // return list
        let newList = getNestedArray(list, '1000')
        return newList
      }
      /*
        {
    field: 'field76',
    component: 'TreeSelect',
    label: `${t('formDemo.default')}`,
    componentProps: {
      renderAfterExpand: false,
      data: treeSelectData
    }
  },*/
    },
    detail: {
      slots: {
        default: (data: any) => {
          return <>{data.departmentName}</>
        }
      }
    }
  },
  {
    field: 'departmentName',
    // label: t('userDemo.remark'),
    label: '部门名称',
    search: {
      hidden: true
    },
    table: { hidden: true },
    component: 'Input',
    detail: {
      hidden: true
    }
  },
  {
    field: 'status',
    label: t('userDemo.status'),
    search: {
      hidden: true
    },
    table: {
      slots: {
        default: (data: any) => {
          const status = data.row.status
          return (
            <>
              <ElTag type={status === 0 ? 'danger' : 'success'}>
                {status === 1 ? t('userDemo.enable') : t('userDemo.disable')}
              </ElTag>
            </>
          )
        }
      }
    },
    form: {
      component: 'Select',
      componentProps: {
        options: [
          {
            value: 0,
            label: t('userDemo.disable')
          },
          {
            value: 1,
            label: t('userDemo.enable')
          }
        ]
      }
    },
    detail: {
      slots: {
        default: (data: any) => {
          return (
            <>
              <ElTag type={data.status === 0 ? 'danger' : 'success'}>
                {data.status === 1 ? t('userDemo.enable') : t('userDemo.disable')}
              </ElTag>
            </>
          )
        }
      }
    }
  },
  {
    field: 'createTime',
    label: t('tableDemo.displayTime'),
    search: {
      hidden: true
    },
    form: {
      hidden: true
    }
  },
  {
    field: 'remark',
    label: t('userDemo.remark'),
    search: {
      hidden: true
    },
    form: {
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 5
      },
      colProps: {
        span: 24
      }
    },
    detail: {
      slots: {
        default: (data: any) => {
          return <>{data.remark}</>
        }
      }
    }
  },
  {
    field: 'action',
    width: '260px',
    label: t('tableDemo.action'),
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      slots: {
        default: (data: any) => {
          return (
            <>
              <ElButton type="primary" onClick={() => action(data.row, 'edit')}>
                {t('exampleDemo.edit')}
              </ElButton>
              <ElButton type="success" onClick={() => action(data.row, 'detail')}>
                {t('exampleDemo.detail')}
              </ElButton>
              <ElButton type="danger" onClick={() => delData(data.row)}>
                {t('exampleDemo.del')}
              </ElButton>
            </>
          )
        }
      }
    }
  }
])

// @ts-ignore
const { allSchemas } = useCrudSchemas(crudSchemas)

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref<DepartmentItem | null>(null)
const actionType = ref('')

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  currentRow.value = null
  dialogVisible.value = true
  actionType.value = ''
}

const delLoading = ref(false)

const batchDel = async (arr: any[]) => {
  const res = await batchDeleteDepartmentApi(arr)
  try {
    if (res['affected'] && res['affected'] != 0) {
      ElMessage({
        type: 'success',
        message: t('common.delSuccess')
      })
      // 删除成功  更新表格
      getList()
    } else {
      ElMessage({
        type: 'error',
        message: t('common.deleteFail')
      })
    }
  } catch (e) {
    ElMessage({
      type: 'error',
      message: '接口异常' + e
    })
  }
}

//  删除部门功能
const delData = async (row: DepartmentItem | any) => {
  if (row == null) {
    //  新增 旁边的   删除按钮 功能
    const elTableRef = await getElTableExpose()
    const selections: any[] = elTableRef?.getSelectionRows()
    // console.log('🚀 ~ file: Department.vue:397 ~ delData ~ selections:', selections)
    if (selections.length == 0) return ElMessage({ type: 'error', message: '当前未选中任何项目!' })
    //  获取所有项目的id 组成数组
    const deleteItemsArr: string[] = selections.map((item) => item['id'])
    // 生成所有id组成的string[] 发给后端批量删除
    batchDel(deleteItemsArr)
  } else if (row?.children.length > 0) {
    // 选中父部门  及其 所有 子部门
    console.log('当前项存在子项目,会一起删除')
    ElMessage({ type: 'error', message: '当前项存在多个子项目,请单个删除' })
  } else {
    // 单个删除
    batchDel([row.departmentId])
  }
  // const elTableExpose = await getElTableExpose()
  // ids.value = row
  //   ? [row.id]
  //   : elTableExpose?.getSelectionRows().map((v: DepartmentItem) => v.id) || []
  // delLoading.value = true
  // await delList(unref(ids).length).finally(() => {
  //   delLoading.value = false
  // })
}

const action = (row: DepartmentItem, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    const res = await saveDepartmentApi(formData)
      .catch(() => {})
      .finally(() => {
        saveLoading.value = false
      })
    if (res) {
      dialogVisible.value = false
      currentPage.value = 1
      getList()
    }
  }
}

//  关闭面板
const closeDialog = () => {
  dialogVisible.value = false
}

// 切换保存按钮状态
const toggleSaveBtn = (value: string) => {
  saveLoading.value = value == 'true' ? true : false
}
</script>

<template>
  <ContentWrap>
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams" />

    <div class="mb-10px">
      <ElButton type="primary" @click="AddAction">{{ t('exampleDemo.add') }}</ElButton>
      <ElButton :loading="delLoading" type="danger" @click="delData(null)">
        {{ t('exampleDemo.del') }}
      </ElButton>
    </div>

    <Table
      v-model:pageSize="pageSize"
      v-model:currentPage="currentPage"
      :columns="allSchemas.tableColumns"
      :data="dataList"
      :loading="loading"
      :pagination="{
        total: total
      }"
      @register="tableRegister"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write
      v-if="actionType !== 'detail'"
      ref="writeRef"
      :form-schema="allSchemas.formSchema"
      :current-row="currentRow"
      @updata-list-by-son="getList"
      @close-dialog-by-son="closeDialog"
      @toggle-save-btn-by-son="toggleSaveBtn"
    />

    <Detail
      v-if="actionType === 'detail'"
      :detail-schema="allSchemas.detailSchema"
      :current-row="currentRow"
    />

    <template #footer>
      <ElButton v-if="actionType !== 'detail'" type="primary" :loading="saveLoading" @click="save">
        {{ t('exampleDemo.save') }}
      </ElButton>
      <ElButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</ElButton>
    </template>
  </Dialog>
</template>
