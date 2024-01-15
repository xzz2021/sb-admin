<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
import { deleteMenuApi, getAllMenuListApi } from '@/api/menu'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { ElButton, ElMessage, ElTag } from 'element-plus'
import { Icon } from '@/components/Icon'
// import { Search } from '@/components/Search'
// import { FormSchema } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import SortMenu from './components/SortMenu.vue'

const { t } = useI18n()

//  表格数据获取在
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const res = await getAllMenuListApi()
    return {
      list: res.data || []
    }
  }
})

const { dataList, loading } = tableState
const { getList } = tableMethods

const tableColumns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('userDemo.index'),
    type: 'index'
  },
  {
    field: 'meta.title',
    label: t('menu.menuName'),
    slots: {
      default: (data: any) => {
        const title = data.row.meta.title
        return <>{title}</>
      }
    }
  },
  {
    field: 'meta.icon',
    label: t('menu.icon'),
    slots: {
      default: (data: any) => {
        const icon = data.row.meta.icon
        if (icon) {
          return (
            <>
              <Icon icon={icon} />
            </>
          )
        } else {
          return null
        }
      }
    }
  },
  // {
  //   field: 'meta.permission',
  //   label: t('menu.permission'),
  //   slots: {
  //     default: (data: any) => {
  //       const permission = data.row.meta.permission
  //       return permission ? <>{permission.join(', ')}</> : null
  //     }
  //   }
  // },
  {
    field: 'component',
    label: t('menu.component'),
    slots: {
      default: (data: any) => {
        const component = data.row.component
        return <>{component === '#' ? '顶级目录' : component === '##' ? '子目录' : component}</>
      }
    }
  },
  {
    field: 'path',
    label: t('menu.path')
  },
  {
    field: 'status',
    label: t('menu.status'),
    slots: {
      default: (data: any) => {
        return (
          <>
            <ElTag type={data.row.status === 0 ? 'danger' : 'success'}>
              {data.row.status === 1 ? t('userDemo.enable') : t('userDemo.disable')}
            </ElTag>
          </>
        )
      }
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    width: 240,
    slots: {
      default: (data: any) => {
        const row = data.row
        return (
          <>
            <ElButton type="primary" onClick={() => action(row, 'edit')}>
              {t('exampleDemo.edit')}
            </ElButton>
            <ElButton type="success" onClick={() => action(row, 'detail')}>
              {t('exampleDemo.detail')}
            </ElButton>
            <ElButton type="danger" onClick={() => deleteAction(row)}>
              {t('exampleDemo.del')}
            </ElButton>
          </>
        )
      }
    }
  }
])

// const searchSchema = reactive<FormSchema[]>([
//   {
//     field: 'meta.title',
//     label: t('menu.menuName'),
//     component: 'Input'
//   }
// ])

// const searchParams = ref({})
// const setSearchParams = (data: any) => {
//   searchParams.value = data
//   getList()
// }

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref()
const actionType = ref('')

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const action = (row: any, type: string) => {
  // console.log('🚀 ~ file: Menu.vue:151 ~ action ~ row:', row)
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

const deleteAction = async (row: any) => {
  try {
    const res = await deleteMenuApi(row.id)
    // return
    if (res?.data?.affected == 1) {
      // 删除成功  更新表格  不向后端请求 直接假删
      dataList.value.splice(
        dataList.value.findIndex((item) => item.id === row.id),
        1
      )
      ElMessage({
        message: t('common.deleteSuccess'),
        type: 'success'
      })
    }
  } catch (err) {
    ElMessage({
      message: t('common.addFail'),
      type: 'error'
    })
  } finally {
  }
}

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  currentRow.value = undefined
  dialogVisible.value = true
  actionType.value = ''
}

const save = async () => {
  const write = unref(writeRef)
  // const formData = await write?.submit()
  await write?.submit()
  // console.log(formData)
  // if (formData) {
  //   saveLoading.value = true
  //   setTimeout(() => {
  //     saveLoading.value = false
  //     dialogVisible.value = false
  //   }, 1000)
  // }
}

//  关闭面板
const closeDialog = () => {
  dialogVisible.value = false
}

// 切换保存按钮状态
const toggleSaveBtn = (value: boolean) => {
  saveLoading.value = value
}

//  用于 keep-alive 保持组件 缓存   则不需要pinia进行存储
defineOptions({
  name: 'MenuXzz'
})
</script>

<template>
  <ContentWrap>
    <!-- <Search :schema="searchSchema" @reset="setSearchParams" @search="setSearchParams" /> -->
    <div class="mb-10px">
      <ElButton type="primary" @click="AddAction">{{ t('exampleDemo.add') }}</ElButton>
      <SortMenu />
    </div>
    <Table
      :columns="tableColumns"
      default-expand-all
      node-key="id"
      :data="dataList"
      :loading="loading"
      @register="tableRegister"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write
      v-if="actionType !== 'detail'"
      ref="writeRef"
      :current-row="currentRow"
      @updata-list-by-son="getList"
      @close-dialog-by-son="closeDialog"
      @toggle-save-btn-by-son="toggleSaveBtn"
    />

    <Detail v-if="actionType === 'detail'" :current-row="currentRow" />

    <template #footer>
      <ElButton v-if="actionType !== 'detail'" type="primary" :loading="saveLoading" @click="save">
        {{ t('exampleDemo.save') }}
      </ElButton>
      <ElButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</ElButton>
    </template>
  </Dialog>
</template>
