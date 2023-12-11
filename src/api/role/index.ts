import request from '@/axios'

export const getRoleListApi2 = () => {
  return request.get({ url: '/mock/role/table' })
}

export const getRoleListApi = () => {
  return request.get({ url: '/api/role/getRoletable' })
}

export const addDepartmentApi = (data: any) => {
  return request.post({ url: '/api/department/add', data })
}

export const deleteDepartmentApi = (id: number) => {
  return request.delete({ url: '/api/department/', id })
}

interface addRoleType {
  role: string
  status: string
}
export const addRoleApi = (data: any) => {
  return request.post({ url: '/api/role/addRole', data })
}

export const deleteRoleApi = (id: number) => {
  return request.delete({ url: '/api/role/', id })
}
