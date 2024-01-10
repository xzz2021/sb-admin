<script setup lang="tsx">
import { deleteUserByIdApi, getDepartmentApi, getUserByIdApi, saveUserApi } from '@/api/department'
import type { DepartmentItem, DepartmentUserItem } from '@/api/department/types'
import { getRoleListIdApi } from '@/api/role'
import { ContentWrap } from '@/components/ContentWrap'
import { Dialog } from '@/components/Dialog'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useI18n } from '@/hooks/web/useI18n'
import { useTable } from '@/hooks/web/useTable'
import { ElButton, ElDivider, ElInput, ElTree } from 'element-plus'
import { nextTick, reactive, ref, unref, watch } from 'vue'
import Detail from './components/Detail.vue'
import Write from './components/Write.vue'

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
    let { list = [], total = 0 } = res?.data
    return { list, total }
  },
  fetchDelApi: async () => {
    // 数据依然按数组  传递   后续可以直接开放 批量删除功能
    const res = await deleteUserByIdApi(unref(ids))
    return !!res
  }
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

// const test = (val) => {
//   console.log('🚀 ~ file: User.vue:52 ~ test ~ val:', val)
// }
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
  {
    field: 'password',
    label: '登录密码',
    form: {
      componentProps: {
        placeholder: '留空表示不更改密码'
      }
    },
    table: { hidden: true },
    search: { hidden: true },
    detail: { hidden: true }
  },
  {
    field: 'nickname',
    label: '昵称'
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
      hidden: true
      // component: 'TreeSelect'
      // componentProps: {
      //   // nodeKey: 'id',
      //   // 'value-key': 'id',
      //   props: {
      //     label: 'departmentName'
      //     // value: 'department.id'
      //   }
      // },
      // optionApi: async () => {
      //   const res = await getDepartmentApi()
      //   return res.data
      // }
    }
  },
  //  模拟项================================================================
  {
    // 此处为   编辑用户 信息时   供  下拉选择的  项目
    field: 'department',
    label: t('userDemo.department'),
    search: { hidden: true },
    table: { hidden: true },
    detail: { hidden: true },
    // value: (data) => {
    //   return data.department
    // },
    // value: 'department',

    form: {
      // value: unref(treeSelectRef)?.getCurrentKey(),
      component: 'TreeSelect',
      componentProps: {
        ref: 'treeSelectRef',
        nodeKey: 'id',
        'value-key': 'id',
        'highlight-current': true,
        'value-format': 'object',
        'default-expand-all': true,
        // 'default-checked-keys': ['id'],
        // 'check-strictly': true,
        on: {
          change: (_val) => {
            unref(treeSelectRef)?.setCurrentKey([_val])
          }
        },
        // data: 'department',
        props: {
          label: 'departmentName',
          children: 'children'
        }
      },
      optionApi: async () => {
        const res = await getDepartmentApi()
        return res.data
        // .map((v) => ({
        //   label: v.departmentName,
        //   children: v.children,
        //   value: v // 提交表单时  下拉选项 所 返回的值
        // }))
      }
    }
  },
  {
    //  新增-------------------此处为   编辑用户 信息时   供  下拉选择的  项目-----------------------------
    field: 'role', //  对应表单数据data 返回的新字段   值为下拉选择的值
    label: t('userDemo.role'),
    table: { hidden: true },
    detail: { hidden: true },
    search: { hidden: true },

    form: {
      component: 'Select',
      // value: {},

      componentProps: {
        // on: {
        //   change: async (_val: string) => {
        //     // const formData = await getFormData()
        //     console.log('🚀 ~ file: User.vue:184 ~ val:', _val)
        //   }
        // },
        // slots: {
        'value-key': 'id',
        value: (data) => {
          if (data.role) {
            return { label: data.role.roleName, value: data.role.id }
          }
        }
      },

      optionApi: async () => {
        // 新增 角色 表单  获取  角色 选择下拉项
        //  此处 只获取角色 id 及 角色  名称  用于 下拉  并返回  id用于更新用户信息
        const res = await getRoleListIdApi()
        const newArr = res.data.slice(1) //  移除 超级管理员 权限
        return newArr.map((v) => ({
          label: v.roleName,
          value: v // 提交表单时  下拉选项 所 返回的值
        }))
      }
    }
  },
  {
    field: 'role.roleName', //  对应表单数据data 返回的新字段   值为下拉选择的值 ?? 表格显示内容对应的 字段
    label: t('userDemo.role'),
    form: {
      hidden: true,
      component: 'Select'
    }
  },
  {
    field: 'createTime',
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
  // console.log('🚀 ~ file: User.vue:321 ~ fetchDepartment ~ res.data:', res.data)
  // currentNodeKey.value = (res.data && res.data[0]?.children && res.data[0].children[0].id) || ''
  // currentNodeKey.value = (res.data && res.data[0].id) || 1
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
const ids = ref<number[]>([])

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

const treeSelectRef = ref<typeof ElTree>()

const action = (row: DepartmentUserItem, type: string) => {
  // console.log('🚀 ~ file: User.vue:369 ~ action ~ row:', row)
  row.password = ''
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  // currentRow.value = { ...row, department: unref(treeSelectRef)?.getCurrentNode() || {} }
  currentRow.value = { ...row }
  //  回显数据??
  row?.department && (row.department.label = row.department.departmentName)
  // console.log('🚀 ~ file: User.vue:373 ~ action ~ currentRow.value:', currentRow.value)
  dialogVisible.value = true
  unref(treeSelectRef)?.setCheckedKeys([row.department.id])
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

//  关闭面板
const closeDialog = () => {
  dialogVisible.value = false
}

// 切换保存按钮状态
const toggleSaveBtn = (value: boolean) => {
  // saveLoading.value = value == 'true' ? true : false
  saveLoading.value = value
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
        <ElButton :loading="delLoading" v-hasPermi="'all'" type="danger" @click="delData()">
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
        @updata-list-by-son="getList"
        @close-dialog-by-son="closeDialog"
        @toggle-save-btn-by-son="toggleSaveBtn"
        :autoSetPlaceholder="false"
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
