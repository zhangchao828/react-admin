import React, { PureComponent, ReactNode } from 'react'
import Layout, { LayoutProps } from '../Layout'
import { Redirect } from 'react-router-dom'
import AppContext from '../AppContext'

interface AppProps extends LayoutProps {
  loginPage?: string
  isLogin?: () => boolean
  // 自定义渲染
  render?: (wrappedPage: ReactNode) => ReactNode
}
export default class extends PureComponent<AppProps> {
  static defaultProps = {
    loginPage: 'login',
    isLogin: () => true
  }
  static contextType = AppContext
  render() {
    const { activePage } = this.context
    const { children, loginPage, isLogin, render, ...rest } = this.props
    let wrappedPage: ReactNode = null
    if (activePage === loginPage) {
      wrappedPage = children
    } else if (isLogin() === false) {
      wrappedPage = <Redirect to={`/${loginPage}`} />
    } else {
      wrappedPage = <Layout {...rest}>{children}</Layout>
    }
    if (render) {
      return render(wrappedPage)
    }
    return wrappedPage
  }
}
