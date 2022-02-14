interface AuthConfig {
  authorities?: Array<string | number> | object
}
type AuthValueFunc = (config?: AuthConfig) => boolean
export type AuthValue = string | number | AuthValueFunc
export interface AuthProps {
  value?: AuthValue
  // 没有权限的时候显示，如果没配置会显示AppContext传入的fallback，默认为undefined
  fallback?: any
  children?: any
}
export declare function auth(value: AuthValue)
export declare function Auth(props?: AuthProps)
