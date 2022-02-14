import { ReactNode, Component, LazyExoticComponent } from 'react'
interface ComponentMap {
  [path: string]: Component | LazyExoticComponent
}
interface Matched {
  match: false | { params: object; [name: string]: any }
  Page: ReactNode
  layouts: Array<string>
}
interface WrapOptions {
  layouts?: Array<string>
  layoutsMap?: ComponentMap
}
export declare function wrapPage(Page: ReactNode, options: WrapOptions): ReactNode
export declare function matchPage(pathname: string, routesMap: ComponentMap): Matched
