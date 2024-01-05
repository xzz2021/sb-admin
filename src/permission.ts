import router from './router'
// import { useAppStoreWithOut } from '@/store/modules/app'
import type { RouteRecordRaw } from 'vue-router'
import { useTitle } from '@/hooks/web/useTitle'
import { useNProgress } from '@/hooks/web/useNProgress'
import { usePermissionStoreWithOut } from '@/store/modules/permission'
import { usePageLoading } from '@/hooks/web/usePageLoading'
import { NO_REDIRECT_WHITE_LIST } from '@/constants'
import { useUserStoreWithOut } from '@/store/modules/user'

const { start, done } = useNProgress()

const { loadStart, loadDone } = usePageLoading()

router.beforeEach(async (to, from, next) => {
  start()
  loadStart()
  const permissionStore = usePermissionStoreWithOut()
  // const appStore = useAppStoreWithOut()
  const userStore = useUserStoreWithOut()
  if (userStore.getTokenKey) {
    // 如果能登录系统  有token 说明有权限
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (permissionStore.getIsAddRouters) {
        // 如果 已经添加  路由  直接放行
        // console.log(
        //   '🚀 ~ file: permission.ts:29 ~ router.beforeEach ~ router.getRoutes():',
        //   router.getRoutes()
        // )
        // const allRouterPath = router.getRoutes().map((item) => item.path)
        // const checkHasPath = allRouterPath.some((path) => to.path == path)
        // if (checkHasPath) {
        //   next()
        //   return
        // } else {
        //   next('/403')
        //   return
        // }
        next()
        return
      }

      // 每次 刷新页面  会走这里

      // 开发者可根据实际情况进行修改
      //  获得当前角色 所拥有的菜单  目前 由后端返回嵌套数据
      // 理论上应该是返回平面数据的  然后由生成路由作 嵌套处理
      const roleRouters = userStore.getRoleRouters || []

      // 是否使用动态路由
      await permissionStore.generateRoutes('server', roleRouters as AppCustomRouteRecordRaw[])

      permissionStore.getAddRouters.forEach((route) => {
        router.addRoute(route as unknown as RouteRecordRaw) // 动态添加可访问路由表
      })
      const redirectPath = from.query.redirect || to.path
      const redirect = decodeURIComponent(redirectPath as string)
      const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
      permissionStore.setIsAddRouters(true)
      next(nextData)
    }
  } else {
    // 登录页 不重定向
    if (NO_REDIRECT_WHITE_LIST.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
    }
  }
})

router.afterEach((to) => {
  useTitle(to?.meta?.title as string)
  done() // 结束Progress
  loadDone()
})
