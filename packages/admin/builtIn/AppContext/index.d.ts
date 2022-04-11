import { Context } from 'react'
import { Location } from 'history'

type AppMeta = {
  // 所有的权限集合列表
  authorities?: any
  // 全局控制没有权限的时候显示的组件
  fallback?: any
  [propName: string]: any
}
type ContextValue = {
  meta: AppMeta
  query: URLSearchParams
  setMeta(data: AppMeta)
  navigate?(
    to: number | string,
    props?: {
      replace?: boolean
      state?: object
    }
  )
  location?: Location
  params?: object
  [propName: string]: any
}

export declare function useAppContext(): ContextValue
export declare function getAppContext(): ContextValue
export declare const AppContext: Context<ContextValue>
