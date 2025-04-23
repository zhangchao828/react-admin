import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

type BaseURLFunc = (conf?: AxiosRequestConfig) => string
type TimeFunc = (conf?: AxiosRequestConfig) => number
type HeadersFunc = (conf?: AxiosRequestConfig) => object
type MockType = {
  delay?: number
  status?: number
  name?: string
  yapiUrl?: string
}
interface Retry {
  /**
   * 延迟多少毫秒重试
   */
  delay?: number
  /**
   * 重试次数
   */
  count?: number
  /**
   * 重试的条件，返回true才重试
   * @param current 当前是第几次重试
   * @param e 当前请求的配置和错误信息
   */
  when?(current: number, e: AxiosError): boolean
}
interface SetConfig {
  transformResult?: (res: AxiosResponse) => any
  error?(e: AxiosError)

  /**
   * 设置了mock之后，会优先寻找本地mock
   * 如果没有再去请求YapiMock
   */
  mock?: MockType | boolean | string
  timeout?: TimeFunc | number
  headers?: HeadersFunc | object
  baseURL?: BaseURLFunc | string
  withCredentials?: boolean
  /**
   * 当请求发生错误时重试
   */
  retry?: number | boolean | Retry
  /**
   * 多少ms内发送了相同请求，那就取消还未完成的上一个请求
   */
  abortTime?: number
  /**
   * 每个请求的标识，为了方便取消某个请求，如果不配置默认是method+url
   */
  key?: any
}
interface HttpRequireConfig extends AxiosRequestConfig, SetConfig {
  type?: 'formData' | 'upload' | 'download'
  /**
   * 下载文件时的文件名，当type为 download 时有效
   */
  fileName?: string
}
interface Http {
  getConfig(): SetConfig
  setConfig(conf: SetConfig)
  /** 原生的，不做任何处理的 */
  original?: boolean
  axios: typeof axios
  (config: HttpRequireConfig): AxiosPromise
  (url: string, config?: HttpRequireConfig): AxiosPromise
  abort(key?: any)
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
