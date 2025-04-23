export interface History {
  push(pathname: string)
  replace(pathname: string)
  goBack()
}
export declare const history: History
export declare function getQuery(name?: string, customSearch?: string): string | object
export declare const HISTORY: string
export declare function useRealPathname(pathname: string): string
export { Link, Redirect } from 'react-router-dom'
