import request from '@/axios'

interface updateEnum {
  enumName: string
  itemJson: string
}

interface keyValue {
  key: string
  value: string
}
interface searchEnum {
  enumName: string
  itemJson: keyValue[]
}
export const addEnumitem = (data: updateEnum) => {
  return request.post({ url: '/api/enumitem/update', data })
}

export const searchEnumitem = (data: string[]) => {
  return request.post<searchEnum[]>({ url: '/api/enumitem/search', data })
}
