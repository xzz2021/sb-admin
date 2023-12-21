<script setup lang="tsx">
import { reactive, ref, watch } from 'vue'
import { Form, FormSchema } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElCheckbox, ElInput, ElLink } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { loginApi, getTestRoleApi, getRoleMenuApi } from '@/api/login'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'
import { UserType } from '@/api/login/types'
import { useValidator } from '@/hooks/web/useValidator'
import { Icon } from '@/components/Icon'
import { useUserStore } from '@/store/modules/user'
import { onMounted } from 'vue'

// import { useEmittXzz } from '@/hooks/event/useEmittXzz'

const { required } = useValidator()

const emit = defineEmits(['to-register'])

const appStore = useAppStore()

const userStore = useUserStore()

const permissionStore = usePermissionStore()

const { currentRoute, addRoute, push } = useRouter()

const { t } = useI18n()

const rules = {
  username: [required()],
  password: [required()]
}

const schema = reactive<FormSchema[]>([
  {
    field: 'title',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return <h2 class="text-2xl font-bold text-center w-[100%]">{t('login.login')}</h2>
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
    colProps: {
      span: 24
    },
    // 使用插槽 jsx 自定义formitem
    formItemProps: {
      slots: {
        default: (formData) => {
          return (
            <div class="w-[100%] flex">
              <ElInput
                showPassword={true}
                v-model={formData.password}
                placeholder={t('login.passwordPlaceholder')}
                // 按下enter键触发登录
                onKeydown={(_e: any) => {
                  if (_e.key === 'Enter') {
                    signIn()
                  }
                }}
              />
            </div>
          )
        }
      }
    }
  },
  {
    field: 'tool',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="flex justify-between items-center w-[100%]">
                <ElCheckbox v-model={remember.value} label={t('login.remember')} size="small" />
                <ElLink type="primary" underline={false}>
                  {t('login.forgetPassword')}
                </ElLink>
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'login',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="w-[100%]">
                <ElButton loading={loading.value} type="primary" class="w-[100%]" onClick={signIn}>
                  {t('login.login')}
                </ElButton>
              </div>
              <div class="w-[100%] mt-15px">
                <ElButton class="w-[100%]" onClick={toRegister}>
                  {t('login.register')}
                </ElButton>
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'other',
    component: 'Divider',
    label: t('login.otherLogin'),
    componentProps: {
      contentPosition: 'center'
    }
  },
  {
    field: 'otherIcon',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="flex justify-between w-[100%]">
                <Icon
                  icon="ant-design:github-filled"
                  size={iconSize}
                  class="cursor-pointer ant-icon"
                  color={iconColor}
                  hoverColor={hoverColor}
                />
                <Icon
                  icon="ant-design:wechat-filled"
                  size={iconSize}
                  class="cursor-pointer ant-icon"
                  color={iconColor}
                  hoverColor={hoverColor}
                />
                <Icon
                  icon="ant-design:alipay-circle-filled"
                  size={iconSize}
                  color={iconColor}
                  hoverColor={hoverColor}
                  class="cursor-pointer ant-icon"
                />
                <Icon
                  icon="ant-design:weibo-circle-filled"
                  size={iconSize}
                  color={iconColor}
                  hoverColor={hoverColor}
                  class="cursor-pointer ant-icon"
                />
              </div>
            </>
          )
        }
      }
    }
  }
])

const iconSize = 30

const remember = ref(true)

const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose } = formMethods

const loading = ref(false)

const iconColor = '#999'

const hoverColor = 'var(--el-color-primary)'

const redirect = ref<string>('')

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)

onMounted(async () => {
  // 挂载时自动填充记住的用户名
  formMethods.setValues({ username: userStore.getRememberUser })
  // 本地持久化切换时需要手动设定
  // appStore.setDynamicRouter(!true)
  // appStore.setServerDynamicRouter(!true)
  //  用于添加  菜单更新 后  触发  重新  获取 路由功能
  // useEmittXzz({
  //   eventname: 'updateMenu',
  //   callback: (_type: string) => {
  //     getRole()
  //   }
  // })
  // useEmittXzz({ eventname: 'updateMenu', callback: getRole })
})

// 登录
// userinfo 包含 password permissions role roleId username
const signIn = async () => {
  const formRef = await getElFormExpose()
  await formRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const formData = await getFormData<UserType>()
      try {
        const res = await loginApi(formData)
        // const { userInfo, tokenKey } = res.data
        if (res) {
          userStore.setUserInfo(res.data.userInfo)
          userStore.setTokenKey(res.data.tokenKey)
          // 是否使用动态路由
          if (appStore.getDynamicRouter) {
            getRole()
          } else {
            await permissionStore.generateRoutes('static').catch(() => {})
            permissionStore.getAddRouters.forEach((route) => {
              addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
            })
            permissionStore.setIsAddRouters(true)
            push({ path: redirect.value || permissionStore.addRouters[0].path })
          }
        }
      } finally {
        // 是否存储 记住用户名
        if (remember.value) {
          userStore.setRememberUser(formData.username)
        } else {
          userStore.setRememberUser('')
        }
        loading.value = false
      }
    }
  })
}

// const formatToTree = (ary: any[], pid: number | undefined) => {
//   return ary
//     .filter((item) =>
//       // 如果没有父id（第一次递归的时候）将所有父级查询出来
//       // 这里认为 item.parentId === 1 就是最顶层 需要根据业务调整
//       pid === undefined ? item.parentId === null : item.parentId === pid
//     )
//     .map((item) => {
//       // 通过父节点ID查询所有子节点
//       item.children = formatToTree(ary, item.id)
//       return item
//     })
// }

// const findBtn = (arr) => {
//   return arr.map((item) => {
//     if (item.children && item.children.length > 0) {
//       if (item.children[0].type == 3) {
//         item.permissionList = item.children
//         item.children.length = 0
//         return item
//       } else {
//         findBtn(item.children)
//       }
//     }
//   })
// }
// 根据用户角色信息 获取  菜单
const getRole = async () => {
  const res =
    appStore.getDynamicRouter && appStore.getServerDynamicRouter
      ? // 其实这里后端可以通过token解析角色数组,不传参也是可以的
        await getRoleMenuApi()
      : await getTestRoleApi()
  if (res && res.data) {
    // console.log('🚀 ~ file: LoginForm.vue:302 ~ getRole ~ res:', res)
    //将meta.title赋值给菜单自身title, 以符合数据格式框架要求
    // 这里是从后端拿到扁平的菜单数据
    //  需要转换成带children的嵌套数据格式
    // let nestedArr = formatToTree(backendMenuAndBtnArr, undefined)
    // let newData = [...backendMenuAndBtnArr, ...adminList]
    // const routers = res.data || []
    const routers = res.data || []
    userStore.setRoleRouters(routers)
    appStore.getDynamicRouter && appStore.getServerDynamicRouter
      ? await permissionStore.generateRoutes('server', routers).catch(() => {})
      : await permissionStore.generateRoutes('frontEnd', routers).catch(() => {})

    permissionStore.getAddRouters.forEach((route) => {
      addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
    })
    permissionStore.setIsAddRouters(true)
    // 获取完角色路由表, 自动跳转
    push({ path: redirect.value || permissionStore.addRouters[0].path })
  } else {
    //  当未获取到路由时
    // 停留在当前页面  提示获取路由失败
  }
}

// 去注册页面
const toRegister = () => {
  emit('to-register')
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
