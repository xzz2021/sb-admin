import request from '@/axios'

export const getMenuListApi = () => {
  return request.get({ url: '/mock/menu/list' })
}

export const getAllMenuListApi = () => {
  return request.get({ url: '/api/menu/getAllMenu' })
}

export const addMenuApi = (data: any) => {
  return request.post({ url: '/api/menu/add', data })
}
