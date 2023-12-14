import request from '@/axios'

export const getMenuListApi = () => {
  return request.get({ url: '/mock/menu/list' })
}

//   这是开发 模拟 菜单的获取
export const getAllMenuListApi = () => {
  return request.get({ url: '/api/menu/getAllMenu' })
}

export const getAllMenuListApi222 = () => {
  return request.get({ url: '/api/menu/getAllMenu222' })
}

export const addMenuApi = (data: any) => {
  return request.post({ url: '/api/menu/add', data })
}
