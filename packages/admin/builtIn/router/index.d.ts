export declare function navigate(
  to: string | number,
  props?: {
    replace?: boolean
    state?: any
  }
)
export declare function getParams(name?: string): object | string
export declare function useParams(name?: string): object | string
export declare function getQuery(name?: string): string | URLSearchParams
export { Redirect, useLocation, Link, NavLink } from 'react-router-dom'
