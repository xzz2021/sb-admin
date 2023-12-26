<template>
  <div>模拟物品下发</div>

  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
    :size="formSize"
    status-icon
  >
    <el-form-item label="提交内容" prop="content">
      <el-input v-model="ruleForm.content" />
    </el-form-item>
    <el-form-item label="备注信息" prop="applyRemark">
      <el-input v-model="ruleForm.applyRemark" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)"> 提交申请 </el-button>
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { addApplyApi } from '@/api/playeroperation'

interface RuleForm {
  content: string
  applyRemark: string
}

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  content: '',
  applyRemark: ''
})

const rules = reactive<FormRules<RuleForm>>({
  content: [{ required: true, message: '输入提交内容!', trigger: 'blur' }]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        // return
        const res = await addApplyApi(ruleForm)
        console.log('🚀 ~ file: index.vue:52 ~ awaitformEl.validate ~ res:', res)
      } catch (error) {}
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>
