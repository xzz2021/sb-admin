import request from '@/axios'
import type { UserRegisterType, UserType } from './types'

interface RoleParams {
  roleName: string
}

// export const loginApi2 = (data: UserType): Promise<IResponse<UserType>> => {
//   return request.post({ url: '/mock/user/login', data })
// }

export const loginApi = (data: UserType): Promise<IResponse<UserType>> => {
  return request.post({ url: 'api/userinfo/login', data })
}

export const registerApi = (data: UserRegisterType): Promise<IResponse<UserType>> => {
  return request.post({ url: 'api/userinfo/register', data })
}

export const loginOutApi = (): Promise<IResponse> => {
  return request.get({ url: '/mock/user/loginOut' })
}

export const getUserListApi = ({ params }: AxiosConfig) => {
  return request.get<{
    code: string
    data: {
      list: UserType[]
      total: number
    }
  }>({ url: '/mock/user/list', params })
}

export const getAdminRoleApi = (
  params: RoleParams
): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  return request.get({ url: '/mock/role/list', params })
}

export const getTestRoleApi = (params: RoleParams): Promise<IResponse<string[]>> => {
  return request.get({ url: '/mock/role/list2', params })
}
