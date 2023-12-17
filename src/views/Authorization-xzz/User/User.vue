<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { ref, unref, nextTick, watch, reactive } from 'vue'
import { ElButton, ElTree, ElInput, ElDivider } from 'element-plus'
import {
  // getDepartmentApi,
  getUserByIdApi,
  saveUserApi,
  deleteUserByIdApi,
  getDepartmentApi
} from '@/api/department'
import type { DepartmentItem, DepartmentUserItem } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { getRoleListApi } from '@/api/role'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'

const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    //  获取部门 用户列表
    const res = await getUserByIdApi({
      // 查询需要传参数
      id: unref(currentNodeKey),
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams)
    })
    console.log('🚀 ~ file: User.vue:28 ~ fetchDataApi: ~ res:', res)
    const total = res?.data?.length
    return {
      list: res.data || [],
      total: total || 0
    }
  },
  fetchDelApi: async () => {
    const res = await deleteUserByIdApi(unref(ids))
    return !!res
  }
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

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
    label: t('userDemo.index'),
    form: {
      hidden: true
    },
    search: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      type: 'index'
    }
  },
  {
    field: 'username',
    label: '登录账户'
  },
  // {
  //   field: 'password',
  //   label: '登录密码',
  //   // componentProps: {
  //   //   props: {
  //   //     disabled: true
  //   //   }
  //   // },
  //   search: {
  //     hidden: true
  //   }
  // },
  {
    field: 'nickname',
    label: t('userDemo.username')
  },
  {
    // 显示  数据  对应的 键
    field: 'department.departmentName',
    label: t('userDemo.department'),
    // detail: {
    //   hidden: true
    //   // slots: {
    //   //   default: (data: DepartmentUserItem) => {
    //   //     return <>{data.department.departmentName}</>
    //   //   }
    //   // }
    // },
    search: {
      hidden: true
    },
    form: {
      component: 'TreeSelect',
      componentProps: {
        nodeKey: 'id',
        props: {
          label: 'departmentName'
          // value: 'department.id'
        }
      },
      optionApi: async () => {
        const res = await getDepartmentApi()
        return res.data
      }
    }
    // table: {
    //   hidden: true
    // }
  },
  {
    field: 'role.roleName', //  对应表单数据data 返回的新字段   值为下拉选择的值
    label: t('userDemo.role'),
    form: {
      component: 'Select',
      value: {},
      componentProps: {
        // multiple: true,
        // collapseTags: true,
        maxCollapseTags: 1,
        on: {
          change: async (val: string) => {
            // const formData = await getFormData()
            // console.log('🚀 ~ file: User.vue:184 ~ val:', val)
          }
        }
      },

      optionApi: async () => {
        // 新增 角色 表单  获取  角色 选择下拉项
        const res = await getRoleListApi()
        // return res.data.role
        return res.data?.map((v) => ({
          label: v.roleName,
          value: v.id // 提交表单时  下拉选项 所 返回的值
        }))
      }
    }
  },
  // {
  //   field: 'email',
  //   label: t('userDemo.email'),
  //   form: {
  //     component: 'Input'
  //   },
  //   search: {
  //     hidden: true
  //   }
  // },
  {
    field: 'createtime',
    label: t('userDemo.createTime'),
    form: {
      component: 'Input',
      hidden: true
    },
    search: {
      hidden: true
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    search: {
      hidden: true
    },
    table: {
      width: 240,
      slots: {
        default: (data: any) => {
          const row = data.row as DepartmentUserItem
          return (
            <>
              <ElButton
                type="primary"
                v-show={row?.role?.roleName != '超级管理员'}
                onClick={() => action(row, 'edit')}
              >
                {t('exampleDemo.edit')}
              </ElButton>
              <ElButton
                type="success"
                v-show={row?.role?.roleName != '超级管理员'}
                onClick={() => action(row, 'detail')}
              >
                {t('exampleDemo.detail')}
              </ElButton>
              <ElButton
                type="danger"
                v-show={row?.role?.roleName != '超级管理员'}
                onClick={() => delData(row)}
              >
                {t('exampleDemo.del')}
              </ElButton>
            </>
          )
        }
      }
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const searchParams = ref({})
const setSearchParams = (params: any) => {
  currentPage.value = 1
  searchParams.value = params
  getList()
}

const treeEl = ref<typeof ElTree>()

const currentNodeKey = ref('')
const departmentList = ref<DepartmentItem[]>([])
const fetchDepartment = async () => {
  const res = await getDepartmentApi()
  departmentList.value = res.data
  currentNodeKey.value = (res.data && res.data[0]?.children && res.data[0].children[0].id) || ''
  await nextTick()
  unref(treeEl)?.setCurrentKey(currentNodeKey.value)
}
fetchDepartment()

const currentDepartment = ref('')
watch(
  () => currentDepartment.value,
  (val) => {
    unref(treeEl)!.filter(val)
  }
)

const currentChange = (data: DepartmentItem) => {
  // if (!data.id) return
  currentNodeKey.value = data.id
  currentPage.value = 1
  getList()
}

const filterNode = (value: string, data: DepartmentItem) => {
  if (!value) return true
  return data.departmentName.includes(value)
}

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref<DepartmentUserItem>()
const actionType = ref('')

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  currentRow.value = undefined
  dialogVisible.value = true
  actionType.value = ''
}

const delLoading = ref(false)
const ids = ref<string[]>([])

const delData = async (row?: DepartmentUserItem) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row
    ? [row.id]
    : elTableExpose?.getSelectionRows().map((v: DepartmentUserItem) => v.id) || []
  delLoading.value = true

  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}

const action = (row: DepartmentUserItem, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  currentRow.value = { ...row, department: unref(treeEl)?.getCurrentNode() || {} }
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    try {
      const res = await saveUserApi(formData)
      if (res) {
        currentPage.value = 1
        getList()
      }
    } catch (error) {
      console.log(error)
    } finally {
      saveLoading.value = false
      dialogVisible.value = false
    }
  }
}
</script>

<template>
  <div class="flex w-100% h-100%">
    <ContentWrap class="w-250px">
      <div class="flex justify-center items-center">
        <div class="flex-1">{{ t('userDemo.departmentList') }}</div>
        <ElInput
          v-model="currentDepartment"
          class="flex-[2]"
          :placeholder="t('userDemo.searchDepartment')"
          clearable
        />
      </div>
      <ElDivider />
      <ElTree
        ref="treeEl"
        :data="departmentList"
        default-expand-all
        :expand-on-click-node="false"
        node-key="id"
        :current-node-key="currentNodeKey"
        :props="{
          label: 'departmentName'
        }"
        :filter-node-method="filterNode"
        @current-change="currentChange"
      >
        <template #default="{ data }">
          <div
            :title="data.departmentName"
            class="whitespace-nowrap overflow-ellipsis overflow-hidden"
          >
            {{ data.departmentName }}
          </div>
        </template>
      </ElTree>
    </ContentWrap>
    <ContentWrap class="flex-[3] ml-20px">
      <Search
        :schema="allSchemas.searchSchema"
        @reset="setSearchParams"
        @search="setSearchParams"
      />

      <div class="mb-10px">
        <ElButton type="primary" v-hasPermi="'all'" @click="AddAction">{{
          t('exampleDemo.add')
        }}</ElButton>
        <ElButton :loading="delLoading" type="danger" @click="delData()">
          {{ t('exampleDemo.del') }}
        </ElButton>
      </div>
      <Table
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :columns="allSchemas.tableColumns"
        :data="dataList"
        :loading="loading"
        @register="tableRegister"
        :pagination="{
          total
        }"
      />
    </ContentWrap>

    <Dialog v-model="dialogVisible" :title="dialogTitle">
      <Write
        v-if="actionType !== 'detail'"
        ref="writeRef"
        :form-schema="allSchemas.formSchema"
        :current-row="currentRow"
      />

      <Detail
        v-if="actionType === 'detail'"
        :detail-schema="allSchemas.detailSchema"
        :current-row="currentRow"
      />

      <template #footer>
        <ElButton
          v-if="actionType !== 'detail'"
          type="primary"
          :loading="saveLoading"
          @click="save"
        >
          {{ t('exampleDemo.save') }}
        </ElButton>
        <ElButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</ElButton>
      </template>
    </Dialog>
  </div>
</template>
