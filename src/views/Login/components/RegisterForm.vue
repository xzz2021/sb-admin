<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { reactive, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { useForm } from '@/hooks/web/useForm'
import { ElButton, ElInput, ElMessage, FormRules } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { UserRegisterType } from '@/api/login/types'
import { registerApi } from '@/api/login'

const emit = defineEmits(['to-login'])

const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose } = formMethods

const { t } = useI18n()

const { required } = useValidator()

const schema = reactive<FormSchema[]>([
  {
    field: 'title',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return <h2 class="text-2xl font-bold text-center w-[100%]">{t('login.register')}</h2>
        }
      }
    }
  },
  {
    field: 'username',
    label: t('login.username'),
    value: '',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('login.usernamePlaceholder')
    }
  },
  {
    field: 'password',
    label: t('login.password'),
    value: '',
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      strength: true,
      placeholder: t('login.passwordPlaceholder')
    }
  },
  {
    field: 'check_password',
    label: t('login.checkPassword'),
    value: '',
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      strength: true,
      placeholder: t('login.passwordPlaceholder')
    }
  },
  {
    field: 'nickname',
    label: '昵称',
    value: '',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: '输入你的称呼'
    }
  },
  {
    field: 'code',
    label: t('login.code'),
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: (formData) => {
          return (
            <div class="w-[100%] flex">
              <ElInput v-model={formData.code} placeholder={t('login.codePlaceholder')} />
            </div>
          )
        }
      }
    }
  },
  {
    field: 'register',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="w-[100%]">
                <ElButton
                  type="primary"
                  class="w-[100%]"
                  loading={loading.value}
                  onClick={loginRegister}
                >
                  {t('login.register')}
                </ElButton>
              </div>
              <div class="w-[100%] mt-15px">
                <ElButton class="w-[100%]" onClick={toLogin}>
                  {t('login.hasUser')}
                </ElButton>
              </div>
            </>
          )
        }
      }
    }
  }
])

// 校验两次密码是否一致规则
const checkPwd = async (_rule: any, value: any, callback: any) => {
  // 获取用户名表单数据
  const formData = await getFormData<UserRegisterType>()
  if (value === '') {
    callback(new Error('请再次输入密码!'))
  } else if (value !== formData.password) {
    callback(new Error(t('common.isEqual')))
  } else {
    callback()
  }
}

const rules: FormRules = {
  username: [required()],
  password: [required()],
  check_password: [{ asyncValidator: checkPwd, trigger: 'blur' }],
  code: [required()]
}

const toLogin = () => {
  emit('to-login')
}

const loading = ref(false)

const loginRegister = async () => {
  const formRef = await getElFormExpose()
  formRef?.validate(async (valid: boolean) => {
    if (valid) {
      const formData = await getFormData<UserRegisterType>()
      // let { password, check_password } = formData
      // if (password != check_password) return ElMessage.error(t('common.isEqual'))
      try {
        loading.value = true
        if (formData.code != '999') return ElMessage.error('验证码错误，请稍后再试！')
        // ElMessage.success('注册成功！')
        // return
        const res = await registerApi(formData)
        if (res) {
          ElMessage.success('注册成功！')
          toLogin()
        } else {
          ElMessage.error('网络异常，请稍后再试！')
        }
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<template>
  <Form
    :schema="schema"
    :rules="rules"
    label-position="top"
    hide-required-asterisk
    size="large"
    class="dark:(border-1 border-[var(--el-border-color)] border-solid)"
    @register="formRegister"
  />
</template>
