import request from '@/axios'

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
