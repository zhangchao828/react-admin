import React from 'react'

type AppData = {
  // 所有的权限集合列表
  access?: any
  [propName: string]: any
}
type MainProps = {
  context?: Omit<ContextValue, 'federation' | 'main' | 'removeKeepAlive'>
  [propName: string]: any
}
type RouteMatch = {
  params: object
  path: string
}
type ContextValue = {
  data: AppData
  setAppData(data: AppData)
  matchRoute?(pathname: string): RouteMatch
  removeKeepAlive?(pathname: string)
  federation?: string
  main?: MainProps
  [propName: string]: any
}
/**
 * 运行时配置
 */
type KeepAlive = (config: { pathname: string }) => boolean
type AppConfig = {
  /**
   * 页面是否缓存
   */
  keepAlive?: boolean | KeepAlive
  /**
   * 路由模式
   */
  mode?: 'browser' | 'hash'
}
interface MatchedRoute {
  params: object
  path: string
  url: string
}
export declare function useAppContext(): ContextValue
export declare function getAppContext(): ContextValue
export declare const AppContext: React.Context<ContextValue>
export declare function defineApp(App: any, config: AppConfig)
export declare function matchRoute(pathname: string): MatchedRoute

/**
 * 本地的ip地址，只有本地开发环境才有值
 */
type TypeArgv = {
  env: string
  cicd_base_url: string
  [other: string]: string
}
export declare const adminConfig: {
  name: string
  publicPath: string
  localIp: string
  federation: string
  base: string
  argv: TypeArgv
}
/**
 * 获取最新发布信息,
 * 只有生产环境有效
 */
interface PublishData {
  time?: number
}
export declare function getLatestPublishData(publicPath?: string): Promise<PublishData>
