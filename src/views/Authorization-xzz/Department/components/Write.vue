<script setup lang="ts">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { DepartmentItem } from '@/api/department/types'
import { addDepartmentApi } from '@/api/role'
import { ElMessage } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<Nullable<DepartmentItem>>,
    default: () => null
  },
  formSchema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  }
})

const rules = reactive({
  id: [required()],
  status: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

interface Emits {
  (e: 'updataListBySon'): void
  (e: 'closeDialogBySon'): void
  (e: 'toggleSaveBtnBySon', payload: string): void
}
//  触发父组件  更新角色列表功能
let emit = defineEmits<Emits>()

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    emit('toggleSaveBtnBySon', 'true')
    const formData = await getFormData()
    try {
      const res = await addDepartmentApi(formData)
      if (res) {
        ElMessage({
          message: t('common.addSuccess'),
          type: 'success'
        })
        //  触发父组件  更新部门列表功能
        emit('updataListBySon')
        // 清空表单并关闭dialog
        emit('closeDialogBySon')
        const elFormExpose = await getElFormExpose()
        elFormExpose?.resetFields()
      }
    } catch (err) {
      ElMessage({
        message: t('common.addFail'),
        type: 'success'
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
