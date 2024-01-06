import { getRoleMenuApi } from '@/api/login'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

//  定义可复用的  更新菜单 函数
export const updateMenu = async () => {
  // 修改菜单 后更新 当前菜单 路由
  const res = await getRoleMenuApi()
  if (res && res.data) {
    const routers = res.data || []
    // 更新 设定路由  让用户 手动 刷新页面 避免每次更改刷新
    userStore.setRoleRouters(routers)
  } else {
    //  当未获取到路由时
    // 停留在当前页面  提示获取路由失败
  }
}
