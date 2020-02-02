import React from 'react'
import { BrowserRouter } from 'react-router-dom'

/**
 * 整个应用的入口文件，在这里可以设置一些初始化的配置、样式等
 * 比如配置BrowserRouter还是HashRouter(必须二选一)
 * 比如配置第三方库的 Provider
 * children必须在BrowserRouter或HashRouter内部
 */
export default function({ children }) {
  return <BrowserRouter>{children}</BrowserRouter>
}
