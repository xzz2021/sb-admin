import request from '@/axios'
// import type { UserRegisterType, UserType } from './types'

// interface RoleParams {
//   rolesArr: any[]
// }

// export const loginApi2 = (data: UserType): Promise<IResponse<UserType>> => {
//   return request.post({ url: '/mock/user/login', data })
// }

export const get12Hours = () => {
  return request.get({ url: 'api/onlineplayer/12hours' })
}

export const getSpecifyDate = (params: { unixtime: number }) => {
  return request.get({ url: 'api/onlineplayer/specifyDate', params })
}
