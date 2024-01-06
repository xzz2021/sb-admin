import { defineStore } from 'pinia'
import { asyncRouterMap, constantRouterMap } from '@/router'
import {
  // generateRoutesByFrontEnd,
  generateRoutesByServer,
  flatMultiLevelRoutes,
  formatToTree
} from '@/utils/routerHelper'
import { store } from '../index'
import { cloneDeep } from 'lodash-es'
import { useUserStore } from './user'

export interface sortMenuType {
  id?: number
  title?: string
  sort?: number
}
export interface PermissionState {
  routers: AppRouteRecordRaw[]
  addRouters: AppRouteRecordRaw[]
  isAddRouters: boolean
  menuTabRouters: AppRouteRecordRaw[]
  sortMenu: sortMenuType[] // 提取 简化的 菜单数组  用于排序
}

// const hasPermission = (route) => {
//   if (route.meta && route.meta.permission) {
//     // 如果 有 view 查看参数  说明有权限查看
//     return route.meta.permission.some((item) => item.includes('view'))
//   } else {
//     return false
//   }
// }

//  过滤 是否 有查看 路由的 权限 只返回有查看权限的路由
// const filterAsyncRoutes = (routes, roles) => {
//   const res = []
//   routes.forEach((route) => {
//     // 复制一份
//     const tmp = { ...route }
//     // 如果用户有访问权限则加入结果路由表
//     if (hasPermission(roles, tmp)) {
//       // 如果存在子路由则递归过滤之
//       if (tmp.children) {
//         tmp.children = filterAsyncRoutes(tmp.children, roles)
//       }
//       res.push(tmp)
//     }
//   })
//   return res
// }

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routers: [],
    addRouters: [],
    isAddRouters: false,
    menuTabRouters: [],
    sortMenu: []
  }),
  getters: {
    getRouters(): AppRouteRecordRaw[] {
      return this.routers
    },
    getSortMenu(): sortMenuType[] {
      return this.sortMenu
    },
    getAddRouters(): AppRouteRecordRaw[] {
      return flatMultiLevelRoutes(cloneDeep(this.addRouters))
    },
    getIsAddRouters(): boolean {
      return this.isAddRouters
    },
    getMenuTabRouters(): AppRouteRecordRaw[] {
      return this.menuTabRouters
    }
  },
  actions: {
    generateRoutes(
      type: 'server' | 'frontEnd' | 'static',
      rawRouters: AppCustomRouteRecordRaw[]
    ): Promise<unknown> {
      const userStore = useUserStore()
      const userinfo = userStore.getUserInfo
      let routers: AppCustomRouteRecordRaw[] = []
      //  将来后端返回平面数据   可以在这里做一次次级菜单 嵌套处理  然后交给后续 进行 组件引入处理
      if (userinfo?.role?.roleName === '超级管理员') {
        //  如果是超级管理员  后端直接返回的就是嵌套数据
        routers = rawRouters
      } else {
        routers = formatToTree(rawRouters as AppCustomRouteRecordRaw[], undefined)
        //  下面  提取 简化的 菜单数组  用于 进行排序
        const newSortMenus = routers.map((item) => {
          return {
            id: item.id,
            title: item.meta.title,
            sort: item.sort
          }
        })
        this.sortMenu = newSortMenus.sort(function (a, b) {
          if (a.sort && b.sort) {
            return a?.sort - b?.sort
          } else {
            return 1 // 如果值不存在  直接按原有顺序 返回
          }
        })
      }
      return new Promise<void>((resolve) => {
        let routerMap: AppRouteRecordRaw[] = []
        if (type === 'server') {
          // 模拟后端过滤菜单
          routerMap = generateRoutesByServer(routers as AppCustomRouteRecordRaw[])
        } else if (type === 'frontEnd') {
          // 模拟前端过滤菜单
          // routerMap = generateRoutesByFrontEnd(cloneDeep(asyncRouterMap), routers as string[])
        } else {
          // 直接读取静态路由表
          routerMap = cloneDeep(asyncRouterMap)
        }
        //  上面已经生成完成 嵌套结构路由

        //  根据sort进行排序
        routerMap.sort(function (a, b) {
          if (a.sort && b.sort) {
            return a?.sort - b?.sort
          } else {
            return 1 // 如果值不存在  直接按原有顺序 返回
          }
        })
        // 动态路由，404一定要放到最后面
        this.addRouters = routerMap.concat([
          {
            path: '/:path(.*)*',
            redirect: '/404',
            name: '404Page',
            meta: {
              hidden: true,
              breadcrumb: false
            }
          }
        ])
        // 渲染菜单的所有路由
        this.routers = cloneDeep(constantRouterMap).concat(routerMap)
        resolve()
      })
    },
    setIsAddRouters(state: boolean): void {
      this.isAddRouters = state
    },
    setMenuTabRouters(routers: AppRouteRecordRaw[]): void {
      this.menuTabRouters = routers
    }
  },
  persist: {
    paths: ['routers', 'addRouters', 'menuTabRouters']
  }
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
