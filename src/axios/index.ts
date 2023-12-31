import service from './service'
import { CONTENT_TYPE } from '@/constants'
// import { useUserStoreWithOut } from '@/store/modules/user'

const request = (option: AxiosConfig) => {
  // console.log('🚀 ~ file: index.ts:6 ~ request ~ option:', option)
  const { method, params, data, headers, responseType, id } = option
  let url = option.url as string
  if (method == 'delete') url = url + id
  // const userStore = useUserStoreWithOut()
  return service.request({
    url: url,
    method,
    params,
    data,
    responseType: responseType,
    headers: {
      'Content-Type': CONTENT_TYPE,
      // [userStore.getTokenKey ?? 'Authorization']: 'Bearer ' + userStore.getTokenKey ?? '',
      ...headers
    }
  })
}

export default {
  get: <T = any>(option: AxiosConfig) => {
    return request({ method: 'get', ...option }) as Promise<IResponse<T>>
  },
  post: <T = any>(option: AxiosConfig) => {
    return request({ method: 'post', ...option }) as Promise<IResponse<T>>
  },
  delete: <T = any>(option: AxiosConfig) => {
    return request({ method: 'delete', ...option }) as Promise<IResponse<T>>
  },
  put: <T = any>(option: AxiosConfig) => {
    return request({ method: 'put', ...option }) as Promise<IResponse<T>>
  },
  cancelRequest: (url: string | string[]) => {
    return service.cancelRequest(url)
  },
  cancelAllRequest: () => {
    return service.cancelAllRequest()
  }
}
