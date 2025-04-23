import { ReactNode, Component, LazyExoticComponent, Context } from 'react'
interface ComponentMap {
  [path: string]: Component | LazyExoticComponent
}
type Match = {
  params: object
  path: string
  [name: string]: any
}
interface Matched {
  match: Match
  Page: ReactNode
  layouts: string[]
  is404: boolean
  pathLevel: string[]
}
export declare function wrapPage(
  Page: ReactNode | Component | LazyExoticComponent,
  layouts: Array<Component | LazyExoticComponent>,
  props: object,
  key?: string
): ReactNode
interface PageContextValue {
  id: string
  active?: boolean
}
export declare function matchPage(pathname: string, routesMap: ComponentMap): Matched
export declare function findRoute(pathname: string, routesMap: ComponentMap): Match
export declare const PageContext: Context<PageContextValue>
export declare function useActive(): boolean

interface PageData {
  /** IP地址 */
  ip?: string | 'localhost'
  /** 端口号 */
  port: number
  /** 路由地址 */
  path: string
  store?: string
  page: string
  style?: string
  // 是否覆盖已存在的页面
  override?: boolean
}
export declare function createPage(data: PageData): Promise<object>
