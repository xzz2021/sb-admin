import request from '@/axios'
import type { UserType } from './types'

// 上传头像 接口
export const uploadAvatorApi = (data: FormData, headers: any): Promise<IResponse<any>> => {
  return request.post({ url: 'api/upload/avator', data, headers })
}

export const updateUserinfoApi = (data: Partial<UserType>): Promise<IResponse<any>> => {
  return request.post({ url: 'api/userinfo/update', data })
}
