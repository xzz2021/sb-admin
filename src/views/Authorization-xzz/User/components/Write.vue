<script setup lang="ts">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch } from 'vue'
import { DepartmentUserItem } from '@/api/department/types'
import { useValidator } from '@/hooks/web/useValidator'
import { updateUserApi } from '@/api/department'
import { ElMessage } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'

const { required, lengthRange } = useValidator()

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
const { t } = useI18n()

const rules = reactive({
  username: [required(), lengthRange({ min: 5, max: 16, message: '用户名长度需要在5到16位之间!' })],
  // account: [required()],
  department: [required()],
  // roleId: [required()],
  password: [lengthRange({ min: 6, max: 30, message: '密码长度需要在6到30位之间!' })],
  nickname: [required(), lengthRange({ min: 2, max: 20, message: '昵称长度需要在6到20位之间!' })],
  role: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

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
    // const elForm = unref(treeSelectRef)?.getCurrentKey()
    // console.log('🚀 ~ file: Write.vue:44 ~ submit ~ formData:', formData)
    // return

    //  下拉 表单  提交  选项时 会将所选择项的id 覆盖 roleName 或 departmentName 相应字段  所以
    //  需要 提取 字段 根据
    // const roleId = formData.role.id
    // const departmentId = formData.department.id
    // let newFormData
    //  剔除  原有的  角色 和  部门  信息   返回  新的 对应 id
    // const { role, department, ...newFormData } = formData
    // console.log('🚀 ~ file: Write.vue:52 ~ submit ~ newFormData:', newFormData)
    // return
    try {
      // return
      const res = await updateUserApi(formData)
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
