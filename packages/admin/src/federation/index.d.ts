import { FC, ReactNode } from 'react'

interface RemoteProps {
  /**
   * 远程应用的名称,不传会根据pathname尝试从远程路由模块中寻找是哪一个远程应用
   */
  name?: string
  /**
   * 远程应用需要展示的页面的pathname
   * 不指定的话就展示远程应用首页
   */
  pathname?: string
  [propName: string]: any
}
interface LocalProps {
  pathname?: string
  fallback?: ReactNode
  [propName: string]: any
}
interface RemoteComponentProps {
  /**
   * 微前端名称
   */
  name: string
  /**
   * 要渲染的组件名
   */
  is: string
  [other: string]: any
}
declare const RemoteComponent: FC<RemoteComponentProps>
export declare const Remote: FC<RemoteProps> & {
  Component: typeof RemoteComponent
}

export declare const Local: FC<LocalProps>
