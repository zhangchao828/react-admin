import { History } from 'history'

export declare const history: History
export declare function getParams<T extends object = any>(name: keyof T): string
export declare function getParams<T extends object = any>(): T
export declare function useParams<T extends object = any>(name: keyof T): string
export declare function useParams<T extends object = any>(): T
export declare function getQuery<T extends object = any>(name: keyof T): string
export declare function getQuery<T extends object = any>(): T
export { useLocation, Link, Redirect, HashRouter, BrowserRouter } from 'react-router-dom'
