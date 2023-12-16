import request from '@/axios'
import { DepartmentListResponse, DepartmentUserParams, DepartmentUserResponse } from './types'

export const getDepartmentApi000 = () => {
  return request.get<DepartmentListResponse>({ url: '/mock/department/list' })
}

export const getDepartmentApi = () => {
  return request.get<any[]>({ url: '/api/department/getDepartmentTable' })
}

export const getDepartmentApi222 = () => {
  return request.get<DepartmentListResponse>({ url: '/mock/department/list' })
}

export const getUserByIdApi000 = (params: DepartmentUserParams) => {
  return request.get<DepartmentUserResponse>({ url: '/mock/department/users', params })
}

export const getUserByIdApi = (params: DepartmentUserParams) => {
  return request.get<DepartmentUserResponse>({ url: '/api/department/users', params })
}

export const deleteUserByIdApi = (ids: string[] | number[]) => {
  return request.post({ url: '/mock/department/user/delete', data: { ids } })
}

export const saveUserApi = (data: any) => {
  return request.post({ url: '/mock/department/user/save', data })
}

export const saveDepartmentApi = (data: any) => {
  return request.post({ url: '/mock/department/save', data })
}

export const deleteDepartmentApi00 = (ids: string[] | number[]) => {
  return request.post({ url: '/mock/department/delete', data: { ids } })
}

export const deleteDepartmentApi = (id: string) => {
  return request.delete({ url: '/api/department/', id })
}

export const batchDeleteDepartmentApi = (data: string[]) => {
  return request.post({ url: '/api/department/batchDelete', data })
}

export const getDepartmentTableApi0 = (params: any) => {
  return request.get({ url: '/mock/department/table/list', params })
}

export const getDepartmentTableApi = (params: any) => {
  return request.get({ url: '/api/department/getDepartmentTable', params })
}

export const getDepartmentTableApi2 = (params: any) => {
  return request.get({ url: '/api/department/table/list', params })
}
