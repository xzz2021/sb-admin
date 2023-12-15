import request from '@/axios'

//  此为新增或编辑菜单时  内部 请求 当前角色 所有项目 从而进行分配给下一级
export const getMenuListApi = () => {
  return request.get({ url: '/mock/menu/list' })
}

//  此为新增或编辑菜单时  内部 请求 当前角色role 所有项目 从而进行分配给下一级
// export const getMenuListApi = () => {
//   return request.get({ url: '/api/role/list' })
// }

//   这是开发 模拟 菜单的获取
//  此为新增或编辑菜单时  内部 请求 当前角色role 所有项目 从而进行分配给下一级
export const getAllMenuListApi = () => {
  return request.get({ url: '/api/menu/getAllMenu' })
}

export const getAllMenuListApi222 = () => {
  return request.get({ url: '/api/menu/getAllMenu222' })
}

export const addMenuApi = (data: any) => {
  return request.post({ url: '/api/menu/add', data })
}
