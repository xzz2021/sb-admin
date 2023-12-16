<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref, unref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { addMenuApi, getAllMenuListApi } from '@/api/menu'
import { ElTag, ElButton, ElMessage } from 'element-plus'
import AddButtonPermission from './AddButtonPermission.vue'

const { t } = useI18n()

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  }
})

const handleClose = async (tag: any) => {
  const formData = await getFormData()
  // 删除对应的权限
  setValues({
    permissionList: formData?.permissionList?.filter((v: any) => v.value !== tag.value)
  })
}

const showDrawer = ref(false)

const formSchema = reactive<FormSchema[]>([
  {
    field: 'type',
    label: '菜单类型',
    component: 'RadioButton',
    value: 0,
    colProps: {
      span: 24
    },
    componentProps: {
      options: [
        {
          label: '目录',
          value: 0
        },
        {
          label: '菜单',
          value: 1
        }
      ],
      on: {
        change: async (val: number) => {
          const formData = await getFormData()
          console.log('🚀 ~ file: Write.vue:55 ~ change: ~ formData:', formData)
          if (val === 1) {
            setSchema([
              {
                field: 'component',
                path: 'componentProps.disabled',
                value: false
              }
              // {
              //   field: 'permissionList',
              //   path: 'hidden',
              //   value: false
              // },
              // {
              //   field: 'parentId',
              //   path: 'componentProps.disabled',
              //   value: false
              // }
            ])
            setValues({
              component: unref(cacheComponent)
            })
          } else {
            setSchema([
              {
                field: 'component',
                path: 'componentProps.disabled',
                value: true
              }
              //  当选择目录项目, 也就是一级菜单时, 隐藏权限录入按钮功能
              // {
              //   field: 'permissionList',
              //   path: 'hidden',
              //   value: true
              // },
              // {
              //   field: 'parentId',
              //   path: 'componentProps.disabled',
              //   value: true
              // }
            ])

            if (formData.parentId === void 0) {
              setValues({
                component: '#'
              })
            } else {
              setValues({
                component: '##'
              })
            }
          }
        }
      }
    }
  },
  {
    // hidden: true,
    field: 'parentId',
    label: '父级菜单',
    component: 'TreeSelect',
    componentProps: {
      // disabled: true,
      nodeKey: 'id',
      props: {
        label: 'title',
        value: 'id',
        children: 'children'
      },
      highlightCurrent: true,
      expandOnClickNode: false,
      checkStrictly: true,
      checkOnClickNode: true,
      clearable: true,
      on: {
        change: async (val: number) => {
          const formData = await getFormData()
          if (val && formData.type === 0) {
            setValues({
              component: '##'
            })
          } else if (!val && formData.type === 0) {
            setValues({
              component: '#'
            })
          } else if (formData.type === 1) {
            setValues({
              component: unref(cacheComponent) ?? ''
            })
          }
        }
      }
    },
    optionApi: async () => {
      const res = await getAllMenuListApi()
      //  新增菜单 走这里    应当可以 获取 所有的
      console.log('🚀 ~ file: Write.vue:150 ~ optionApi: ~ res:', res)
      return res.data || []
    }
  },
  {
    field: 'meta.title',
    label: t('menu.menuName'),
    component: 'Input'
  },
  {
    field: 'component',
    label: '组件',
    component: 'Input',
    value: '#',
    componentProps: {
      disabled: true,
      placeholder: '#为顶级目录，##为子目录',
      on: {
        change: (val: string) => {
          cacheComponent.value = val
        }
      }
    }
  },
  {
    field: 'name',
    label: t('menu.name'),
    component: 'Input'
  },
  {
    field: 'meta.icon',
    label: t('menu.icon'),
    component: 'Input'
  },
  {
    field: 'path',
    label: t('menu.path'),
    component: 'Input'
  },
  {
    field: 'meta.activeMenu',
    label: t('menu.activeMenu'),
    component: 'Input'
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
    // hidden: true,
    field: 'permissionList',
    label: t('menu.permission'),
    component: 'CheckboxGroup',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: (data: any) => (
          <>
            {data?.permissionList != '' &&
              data?.permissionList?.map((v) => {
                return (
                  <ElTag class="mr-1" key={v.value} closable onClose={() => handleClose(v)}>
                    {v.label}
                  </ElTag>
                )
              })}
            <ElButton type="primary" size="small" onClick={() => (showDrawer.value = true)}>
              添加权限
            </ElButton>
          </>
        )
      }
    }
  },
  {
    field: 'meta.hidden',
    label: t('menu.hidden'),
    component: 'Switch'
  },
  {
    field: 'meta.alwaysShow',
    label: t('menu.alwaysShow'),
    component: 'Switch'
  },
  {
    field: 'meta.noCache',
    label: t('menu.noCache'),
    component: 'Switch'
  },
  {
    field: 'meta.breadcrumb',
    label: t('menu.breadcrumb'),
    component: 'Switch'
  },
  {
    field: 'meta.affix',
    label: t('menu.affix'),
    component: 'Switch'
  },
  {
    field: 'meta.noTagsView',
    label: t('menu.noTagsView'),
    component: 'Switch'
  },
  {
    field: 'meta.canTo',
    label: t('menu.canTo'),
    component: 'Switch'
  }
])

const rules = reactive({
  component: [required()],
  name: [required()],
  path: [required()],
  'meta.title': [required()]
})

interface Emits {
  (e: 'updataListBySon'): void
  (e: 'closeDialogBySon'): void
  (e: 'toggleSaveBtnBySon', payload: string): void
}

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose, setSchema } = formMethods

//  触发父组件  更新角色列表功能
let emit = defineEmits<Emits>()
const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    formData.meta.title && (formData.title = formData.meta.title)
    // return
    try {
      const res = await addMenuApi(formData)

      // return
      if (res) {
        ElMessage({
          message: t('common.addSuccess'),
          type: 'success'
        })
        //  触发父组件  更新菜单列表功能
        emit('updataListBySon')
        // // 清空表单并关闭dialog
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
    return formData
  }
}

const cacheComponent = ref('')

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    cacheComponent.value = currentRow.type === 1 ? currentRow.component : ''
    if (currentRow.parentId === 0) {
      setSchema([
        {
          field: 'component',
          path: 'componentProps.disabled',
          value: true
        }
      ])
    } else {
      setSchema([
        {
          field: 'component',
          path: 'componentProps.disabled',
          value: false
        }
      ])
    }
    if (currentRow.type === 1) {
      setSchema([
        {
          field: 'component',
          path: 'componentProps.disabled',
          value: false
        }
      ])
    } else {
      setSchema([
        {
          field: 'component',
          path: 'componentProps.disabled',
          value: true
        }
      ])
    }
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

// 添加权限按钮
const confirm = async (data: any) => {
  const formData = await getFormData()
  setValues({
    permissionList: [...(formData?.permissionList || []), data]
  })
}
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" />
  <AddButtonPermission v-model="showDrawer" @confirm="confirm" />
</template>
