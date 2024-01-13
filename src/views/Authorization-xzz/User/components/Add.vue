<script setup lang="ts">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { addUserApi } from '@/api/department'
import { ElMessage } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'

const { required, lengthRange } = useValidator()

defineProps({
  formSchema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  }
})

const { t } = useI18n()
const rules = reactive({
  username: [required(), lengthRange({ min: 5, max: 16, message: '用户名长度需要在5到16位之间!' })],
  department: [required()],
  password: [required(), lengthRange({ min: 6, max: 30, message: '密码长度需要在6到30位之间!' })],
  nickname: [required(), lengthRange({ min: 2, max: 20, message: '昵称长度需要在6到20位之间!' })],
  role: [required()]
})

const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose } = formMethods

interface Emits {
  (e: 'updataListBySon'): void
  (e: 'closeDialogBySon'): void
  (e: 'toggleSaveBtnBySon', payload: boolean): void
}

let emit = defineEmits<Emits>()

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    try {
      // return
      const res = await addUserApi(formData)
      if (res.data) {
        ElMessage({
          message: t('common.addSuccess'),
          type: 'success'
        })
        //  触发父组件  更新角色列表功能   也可以采用前端 假push, 节省网络请求
        emit('updataListBySon')
        // 清空表单并关闭dialog
        emit('closeDialogBySon')
        const elFormExpose = await getElFormExpose()
        elFormExpose?.resetFields()
      }
    } catch (err) {
      ElMessage({
        message: t('common.addFail'),
        type: 'error'
      })
    } finally {
      emit('toggleSaveBtnBySon', false)
    }
  }
}

defineExpose({
  submit
})
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" />
</template>
