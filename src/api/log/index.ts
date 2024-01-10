import request from '@/axios'
// import type { UserRegisterType, UserType } from './types'

// interface RoleParams {
//   rolesArr: any[]
// }

// export const loginApi2 = (data: UserType): Promise<IResponse<UserType>> => {
//   return request.post({ url: '/mock/user/login', data })
// }

export const getItemLog = (params: any) => {
  return request.get({ url: 'api/gamelog/item', params })
}

export const getMoneyLog = (params: any) => {
  return request.get({ url: 'api/gamelog/money', params })
}
