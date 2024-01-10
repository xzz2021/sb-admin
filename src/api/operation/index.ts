import request from '@/axios'

export const getLogData = (params: any) => {
  return request.get({ url: 'api/operationLog', params })
}
