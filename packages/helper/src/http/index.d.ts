import {
  AxiosPromise,
  AxiosRequestConfig,
  ResponseType,
  Method,
  AxiosResponse,
  CancelToken,
  CancelStatic,
  CancelTokenStatic,
  AxiosError,
} from 'axios'

type BaseURLFunc = (conf?: AxiosRequestConfig) => string
type TimeFunc = (conf?: AxiosRequestConfig) => number
type HeadersFunc = (conf?: AxiosRequestConfig) => object
type MockType = {
  delay?: number
  status?: number
  name?: string
}
interface SetConfig {
  transformResult?: (res: AxiosResponse) => any | null
  beforeRequest?(config: AxiosRequestConfig): AxiosRequestConfig
  error?(e: AxiosError)
  /**
   * 设置响应延迟时间
   */
  responseDelay?: number
  mock?: MockType | boolean | string
  timeout?: TimeFunc | number
  headers?: HeadersFunc | object
  baseURL?: BaseURLFunc | string
  /**
   * 超时再次请求,设置为数字时表示超时请求的次数
   */
  timeoutRetry?: boolean | number
  withCredentials?: boolean
}
interface HttpRequireConfig extends SetConfig {
  url?: string
  method?: Method
  data?: any
  params?: any
  responseType?: ResponseType
  cancelToken?: CancelToken
  [prop: string]: any
}
interface Http {
  setConfig(conf: SetConfig)
  (config: HttpRequireConfig): AxiosPromise
  (url: string, config?: HttpRequireConfig): AxiosPromise
  Cancel: CancelStatic
  CancelToken: CancelTokenStatic
  isCancel(value: any): boolean
  all<T>(values: (T | Promise<T>)[]): Promise<T[]>
  spread<T, R>(callback: (...args: T[]) => R): (array: T[]) => R
  defaults: AxiosRequestConfig
  getUri(config?: AxiosRequestConfig): string
  request<T = any, R = AxiosResponse<T>>(config: HttpRequireConfig): Promise<R>
  get<T = any, R = AxiosResponse<T>>(url: string, config?: HttpRequireConfig): Promise<R>
  delete<T = any, R = AxiosResponse<T>>(url: string, config?: HttpRequireConfig): Promise<R>
  head<T = any, R = AxiosResponse<T>>(url: string, config?: HttpRequireConfig): Promise<R>
  options<T = any, R = AxiosResponse<T>>(url: string, config?: HttpRequireConfig): Promise<R>
  post<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: HttpRequireConfig
  ): Promise<R>
  put<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: HttpRequireConfig
  ): Promise<R>
  patch<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: HttpRequireConfig
  ): Promise<R>
}

declare const http: Http
export default http
