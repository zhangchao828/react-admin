import { Context } from 'react'
import { History } from 'history'
import { bootstrap, mount, unmount } from '../../initialize/entry/bootstrap'

type AppMeta = {
  // 所有的权限集合列表
  access?: any
  [propName: string]: any
}
type ContextValue = {
  meta: AppMeta
  query: object
  setMeta(data: AppMeta)
  history?: History
  pathname?: string
  params?: object
  [propName: string]: any
}
type MainApp = {
  /**
   * 主应用的history实例
   * 当在微应用想跳转到其他微应用或者主应用的路由地址时使用
   */
  history: History
  [propName: string]: any
}
/**
 * 运行时配置
 */
type AppConfig = {
  microApp?: {
    bootstrap?(props: any)
    mount?(props: any)
    unmount?(props: any)
  }
}
export declare function isMicroApp(): boolean
export declare function useAppContext(): ContextValue
export declare function getAppContext(): ContextValue
export declare function setAppMeta(values: AppMeta)
export declare function getAppMeta(): AppMeta
export declare function useAppMeta(): AppMeta
export declare const AppContext: Context<ContextValue>
export declare function setMainApp(app: any)
export declare function getMainApp(): MainApp

export declare function defineApp(App: any, config: AppConfig)
