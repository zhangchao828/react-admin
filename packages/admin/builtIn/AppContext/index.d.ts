import { ReactNode, Context } from 'react'
import { Location, History } from 'history'

interface AppData {
  // 所有的权限集合列表
  authorities?: any
  // 全局控制没有权限的时候显示的组件
  fallback?: ReactNode
  [propName: string]: any
}
interface ContextValueConf {
  data: AppData
  setAppData(data: AppData)
  history?: History
  location?: Location
  params?: object
  [propName: string]: any
}

export declare function useAppContext(): ContextValueConf
export declare function setAppContext(info: object)
export declare function getAppContext(): ContextValueConf
export declare const AppContext: Context<ContextValueConf>
