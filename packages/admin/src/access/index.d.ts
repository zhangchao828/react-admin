import { FC, ReactNode } from 'react'

type AccessValue = string | number
interface AccessProps {
  /**
   * 权限标识符，一般是字符串
   */
  value?: AccessValue
  /**
   * 没有权限的时候显示
   */
  fallback?: ReactNode
}
export declare const Access: FC<AccessProps>
export declare function useAccess(value: AccessValue): boolean
