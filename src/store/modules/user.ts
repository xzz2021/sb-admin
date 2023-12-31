import { defineStore } from 'pinia'
import { store } from '../index'
import { UserType } from '@/api/login/types'
import { ElMessageBox } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { loginOutApi } from '@/api/login'
import { useTagsViewStore } from './tagsView'
import router from '@/router'

interface UserState {
  userInfo?: UserType
  tokenKey: string
  // token: string
  avator: string
  rememberUser: string
  roleRouters?: string[] | AppCustomRouteRecordRaw[]
}

export const useUserStore = defineStore('user', {
  state: (): UserState => {
    return {
      userInfo: undefined,
      tokenKey: '',
      // token: '',
      roleRouters: undefined,
      rememberUser: '',
      avator: ''
    }
  },
  getters: {
    getTokenKey(): string {
      return this.tokenKey
    },
    getRememberUser(): string {
      return this.rememberUser
    },
    // getToken(): string {
    //   return this.token
    // },
    getUserInfo(): UserType | undefined {
      return this.userInfo
    },
    getRoleRouters(): string[] | AppCustomRouteRecordRaw[] | undefined {
      return this.roleRouters
    }
  },
  actions: {
    setTokenKey(tokenKey: string) {
      this.tokenKey = tokenKey
    },
    setRememberUser(rememberUser: string) {
      this.rememberUser = rememberUser
    },
    // setToken(token: string) {
    //   this.token = token
    // },
    setUserInfo(userInfo?: UserType) {
      this.userInfo = userInfo
    },
    setRoleRouters(roleRouters: string[] | AppCustomRouteRecordRaw[]) {
      this.roleRouters = roleRouters
    },
    logoutConfirm() {
      const { t } = useI18n()
      ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
        confirmButtonText: t('common.ok'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      })
        .then(async () => {
          const res = await loginOutApi().catch(() => {})
          if (res) {
            this.reset()
          }
        })
        .catch(() => {})
    },
    reset() {
      const tagsViewStore = useTagsViewStore()
      tagsViewStore.delAllViews()
      this.setTokenKey('')
      this.setUserInfo(undefined)
      this.setRoleRouters([])
      router.replace('/login')
    },
    logout() {
      this.reset()
    }
  },
  persist: true
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
