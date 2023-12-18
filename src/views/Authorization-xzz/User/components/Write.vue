<script setup lang="ts">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch } from 'vue'
import { DepartmentUserItem } from '@/api/department/types'
import { useValidator } from '@/hooks/web/useValidator'
import { updateUserApi } from '@/api/department'
import { t } from '@wangeditor/editor'
import { ElMessage } from 'element-plus'
import { emit } from 'process'

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<DepartmentUserItem>,
    default: () => undefined
  },
  formSchema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  }
})

const rules = reactive({
  username: [required()],
  account: [required()],
  'department.id': [required()],
  password: [required()],
  nickname: [required()],
  role: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    console.log('🚀 ~ file: Write.vue:44 ~ submit ~ formData:', formData)
    //  下拉 表单  提交  选项时 会将所选择项的id 覆盖 roleName 或 departmentName 相应字段  所以
    //  需要 提取 字段 根据
    // const roleId = formData.role.id
    // const departmentId = formData.department.id
    // let newFormData
    try {
      // return
      const res = await updateUserApi(formData)
      console.log('🚀 ~ file: Write.vue:46 ~ submit ~ res:', res)
      if (res.data) {
        ElMessage({
          message: t('common.addSuccess'),
          type: 'success'
        })
        //  触发父组件  更新角色列表功能   也可以采用前端 假push, 节省网络请求
        // emit('updataListBySon')
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
      // emit('toggleSaveBtnBySon', false)
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
