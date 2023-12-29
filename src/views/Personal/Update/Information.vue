<template>
  <div style="min-width: 200px; max-width: 460px">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>个人信息</span>
        </div>
      </template>

      <el-form-item label="用户头像">
        <AvatorUpload />
      </el-form-item>
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="60px" status-icon>
        <el-form-item label="账户名" prop="username">
          <el-input v-model="ruleForm.username" disabled />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="ruleForm.nickname" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)"> 确认 </el-button>
          <!-- <el-button @click="resetForm(ruleFormRef)">Reset</el-button> -->
        </el-form-item>
      </el-form>
      <!-- <template #footer>Footer content</template> -->
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import AvatorUpload from './AvatorUpload.vue'

interface RuleForm {
  username: string
  nickname: string
  password: string
}

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  username: '',
  nickname: '',
  password: ''
})

const rules = reactive<FormRules<RuleForm>>({
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
  ]
  // password: [
  //   { required: true, message: '请输入密码', trigger: 'blur' },
  //   { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
  // ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('🚀 ~ file: Information.vue:71 ~ awaitformEl.validate ~ ruleForm:', ruleForm)
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
