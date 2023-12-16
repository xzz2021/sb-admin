<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref, unref, nextTick } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElTree, ElCheckboxGroup, ElCheckbox, ElMessage } from 'element-plus'
import { getAllMenuListApi, getAllMenuListApiSelf } from '@/api/menu'
import { filter, eachTree } from '@/utils/tree'
// import { eachTree } from '@/utils/tree'
import { findIndex } from '@/utils'
import { addRoleApi } from '@/api/role'

const { t } = useI18n()

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  }
})

const treeRef = ref<typeof ElTree>()

const formSchema = ref<FormSchema[]>([
  {
    field: 'roleName',
    label: t('role.roleName'),
    component: 'Input'
  },
  {
    field: 'remark',
    label: t('userDemo.remark'),
    component: 'Input',
    span: 24
  },
  {
    field: 'status',
    label: t('menu.status'),
    component: 'Select',
    componentProps: {
      options: [
        {
          label: t('userDemo.disable'),
          value: 0
        },
        {
          label: t('userDemo.enable'),
          value: 1
        }
      ]
    }
  },
  {
    field: 'menu',
    label: t('role.menu'),
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="flex w-full">
                <div class="flex-1">
                  <ElTree
                    ref={treeRef}
                    show-checkbox
                    node-key="id"
                    highlight-current
                    check-strictly={false}
                    expand-on-click-node={false}
                    data={treeData.value}
                    onNode-click={nodeClick}
                  >
                    {{
                      default: (data) => {
                        return <span>{data.data.meta.title}</span>
                      }
                    }}
                  </ElTree>
                </div>
                <div class="flex-1">
                  {unref(currentTreeData) && unref(currentTreeData)?.permissionList ? (
                    <ElCheckboxGroup v-model={unref(currentTreeData).meta.permission}>
                      {unref(currentTreeData)?.permissionList.map((v: any) => {
                        return <ElCheckbox label={v.value}>{v.label}</ElCheckbox>
                      })}
                    </ElCheckboxGroup>
                  ) : null}
                </div>
              </div>
            </>
          )
        }
      }
    }
  }
])

const currentTreeData = ref()
const nodeClick = (treeData: any) => {
  currentTreeData.value = treeData
}

const rules = reactive({
  roleName: [required()],
  role: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const formatToTree = (arr: any[], pid: number | undefined) => {
  arr.map((item) => {
    item.value = item.id
    // if (!item.title) {
    //   item.title = ''
    // }
  })
  return arr
    .filter((item) =>
      // 如果没有父id（第一次递归的时候）将所有父级查询出来
      // 这里认为 item.parentId === 1 就是最顶层 需要根据业务调整
      pid === undefined ? item.parentId === null : item.parentId === pid
    )
    .map((item) => {
      // 通过父节点ID查询所有子节点
      item.children = formatToTree(arr, item.id)
      return item
    })
}

const treeData = ref([])
const getMenuList = async () => {
  //  通过用户角色  请求数据
  const res = await getAllMenuListApiSelf({})
  console.log('🚀 ~ file: Write.vue:140 ~ getMenuList ~ res:', res)
  if (res) {
    // const newData = formatToTree(res.data, undefined)
    treeData.value = res.data
    if (!props.currentRow) return
    await nextTick()
    const checked: any[] = []
    eachTree(props.currentRow.menu, (v) => {
      checked.push({
        id: v.id,
        permission: v.meta?.permission || []
      })
    })
    eachTree(treeData.value, (v) => {
      const index = findIndex(checked, (item) => {
        return item.id === v.id
      })
      // if (index > -1) {
      //   const meta = { ...(v.meta || {}) }
      //   meta.permission = checked[index].permission
      //   v.meta = meta
      // }
    })
    for (const item of checked) {
      unref(treeRef)?.setChecked(item.id, true, false)
    }
    // unref(treeRef)?.setCheckedKeys(
    //   checked.map((v) => v.id),
    //   false
    // )
  }
}
getMenuList()

interface Emits {
  (e: 'updataListBySon'): void
  (e: 'closeDialogBySon'): void
  (e: 'toggleSaveBtnBySon', payload: string): void
}
//  触发父组件  更新角色列表功能   也可以采用前端 假push, 节省网络请求
// const emit = defineEmits(['updataListBySon', 'closeDialogBySon', 'toggleSaveBtnBySon'])
let emit = defineEmits<Emits>()

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    //  获取当前用户
    // const userStore = useUserStore()
    // const aaa = userStore.getUserInfo

    // emit('toggleSaveBtnBySon', 'true')
    const formData = await getFormData()

    const checkedKeys = unref(treeRef)?.getCheckedKeys() || []
    const data = filter(unref(treeData), (item: any) => {
      return checkedKeys.includes(item.id)
    })
    formData.menusArr = data || []
    console.log('🚀 ~ file: Write.vue:201 ~ submit ~ formData:', formData)
    // return
    // 把扁平化的菜单数据发给后端,  菜单关联的权限['edit', 'add'] 是存在item.meta.permission数组里
    // const treeRefData = treeRef.value?.getCheckedNodes(false, true)
    // if (treeRefData.length == 0) {
    //   return ElMessage({
    //     message: '未勾选菜单项,请选择对应菜单',
    //     type: 'error'
    //   })
    // }
    //  如果不是空 要做下判断  遍历其权限
    // const newdata = treeRefData.map((item) => {
    //   if (item.meta?.permission && item.meta?.permission.length > 0) {
    //     const permissionArr = item.meta?.permission
    //     const list = item.permissionList
    //     item.newPermissionList = []
    //     for (let i = 0; i < permissionArr.length; i++) {
    //       const newItem = list.find((listItem) => listItem.value == permissionArr[i])
    //       item.newPermissionList.push(newItem)
    //     }
    //     return item
    //   }
    //   return item
    // })
    // newdata.permissionList = newdata.newPermissionList
    // formData.menusArr = newdata
    // return
    try {
      const res = await addRoleApi(formData)
      if (res) {
        ElMessage({
          message: t('common.addSuccess'),
          type: 'success'
        })
        //  触发父组件  更新角色列表功能   也可以采用前端 假push, 节省网络请求
        emit('updataListBySon')
        // 清空表单并关闭dialog
        // emit('closeDialogBySon')
        const elFormExpose = await getElFormExpose()
        elFormExpose?.resetFields()
      }
    } catch (err) {
      ElMessage({
        message: t('common.addFail'),
        type: 'error'
      })
    } finally {
      emit('toggleSaveBtnBySon', 'false')
    }
  }
}

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    setValues(currentRow)
  },
  {
    deep: true,
    immediate: true
  }
)

defineExpose({
  submit
})
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" />
</template>
