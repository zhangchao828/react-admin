import { ReactNode, Component, LazyExoticComponent } from 'react'
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
  layouts: Array<string>
  is404: boolean
}
export declare function wrapPage(
  Page: ReactNode,
  layouts: Array<Component | LazyExoticComponent>,
  props: object
): ReactNode
export declare function matchPage(pathname: string, routesMap: ComponentMap): Matched
