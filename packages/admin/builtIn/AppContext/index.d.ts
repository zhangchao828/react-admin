import { ReactNode, Context } from 'react'
import { Location, History } from 'history'

interface AppMeta {
  // 所有的权限集合列表
  authorities?: any
  // 全局控制没有权限的时候显示的组件
  fallback?: ReactNode
  [propName: string]: any
}
interface ContextValue {
  meta: AppMeta
  query: URLSearchParams
  setMeta(data: AppMeta)
  history?: History
  location?: Location
  params?: object
  [propName: string]: any
}

export declare function useAppContext(): ContextValue
export declare function getAppContext(): ContextValue
export declare const AppContext: Context<ContextValue>
