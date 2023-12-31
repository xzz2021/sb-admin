<template>
  <div style="min-width: 200px; max-width: 460px">
    <el-card class="box-card" style="height: 500px">
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
          <el-input v-model="ruleForm.password" placeholder="留空表示不更改密码" clearable />
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
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import AvatorUpload from './AvatorUpload.vue'
import { useUserStore } from '@/store/modules/user'
import { onMounted } from 'vue'
import { updateUserinfoApi } from '@/api/userinfo'
import { useValidator } from '@/hooks/web/useValidator'

const userStore = useUserStore()

onMounted(() => {
  const userinfo = userStore.getUserInfo
  if (userinfo) {
    ruleForm.nickname = userinfo.nickname
    ruleForm.username = userinfo.username
  }
})
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
const { required, lengthRange } = useValidator()

const rules = reactive<FormRules<RuleForm>>({
  nickname: [required(), lengthRange({ min: 1, max: 20, message: '昵称太长了,请改个简单点!' })],
  password: [lengthRange({ min: 6, max: 30, message: '密码长度需要在6到30位之间!' })]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const userinfo = userStore.getUserInfo
      const newUserinfo = { ...ruleForm, ...{ avator: userinfo!.avator } }
      try {
        const res = await updateUserinfoApi(newUserinfo)
        if (res && res.data) {
          //  说明更新成功
          userStore.setUserInfo(res.data)
          ElMessage.success('更新成功！')
        } else {
          ElMessage.error('更新失败！')
        }
      } catch (error) {}
    } else {
      console.log('表单提交数据失败', fields)
    }
  })
}
</script>

<style scoped>
:deep(.el-form-item--default) {
  margin-bottom: 30px;
}
</style>
