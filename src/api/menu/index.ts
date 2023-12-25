import request from '@/axios'

export const getMenuListApi = () => {
  return request.get({ url: '/mock/menu/list' })
}

//  此为新增或编辑菜单时  内部 请求 当前角色 所有项目 从而进行分配给下一级
export const getMenuListApi000 = () => {
  return request.get({ url: '/mock/menu/list' })
}

//  此为新增或编辑菜单时  编辑 角色 身份时 内部 请求 当前角色role 所有项目 从而进行分配给下一级
//  此时貌似应该传参  告诉后端用户  角色身份
// export const getMenuListApiByRole = () => {
//   return request.get({ url: '/api/role/getMenu' })
// }

//   这是开发 模拟 菜单的获取  X
//  此为新增或编辑菜单时  内部 请求 当前角色role 所有项目 从而进行分配给下一级   X

//  根据用户角色数组  获取当前用户的菜单 X

// export const getAllMenuListApi222 = () => {
//   return request.get({ url: '/api/role/getMenu' })
// }

// 直接拿到 菜单  表格  列举出来  所有的 菜单项   不考虑用户角色

export const getAllMenuListApi = () => {
  return request.get({ url: '/api/menu/getAllMenu' })
}

export const getAllMenuListApiSelf = (params: any) => {
  return request.get({ url: '/api/menu/getAllMenu', params })
}

export const addMenuApi = (data: any) => {
  return request.post({ url: '/api/menu/add', data })
}

export const deleteMenuApi = (id: number) => {
  return request.delete({ url: '/api/menu/delete', id })
}
