import request from '@/axios'

export const getAllMenuListApiSelf = (params: any) => {
  return request.get({ url: '/api/menu/getAllMenu', params })
}

//  添加申请
export const addApplyApi = (data: any) => {
  return request.post({ url: '/api/itemreview/add', data })
}

export const getAllItems = (params?: { [string: string]: any }) => {
  return request.get({ url: '/api/itemreview/allItems', params })
}

//  更新  申请
export const updateApplyApi = (data: any) => {
  return request.post({ url: '/api/itemreview/update', data })
}
