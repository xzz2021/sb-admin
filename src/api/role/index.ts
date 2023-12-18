import request from '@/axios'

export const getRoleListApi2 = () => {
  return request.get({ url: '/mock/role/table' })
}

export const getRoleListApi = () => {
  return request.get({ url: '/api/role/getRoletable' })
}

//  此处 只获取角色 id 及 角色  名称  用于 下拉  并返回  id用于更新用户信息
export const getRoleListIdApi = () => {
  return request.get({ url: '/api/role/getRoleListId' })
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
