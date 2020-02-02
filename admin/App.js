import React, { Suspense, lazy } from 'react'
import { hot } from 'react-hot-loader/root'
import { Route } from 'react-router-dom'
import { pages, layout, root } from './store'
import DefaultLayout from './layout'
import DefaultRoot from './root'
import AppContext from '../components/AppContext'

const indexPage = lazy(() => import('./indexPage'))
const Loading = () => null
function App() {
  // 如果用户没有入口根组件时，渲染默认的入口组件
  const Root = root.component || DefaultRoot
  return (
    <Root>
      <Route
        render={props => {
          let { pathname } = props.location
          // 根路由/会匹配到pages/index页面
          pathname = pathname.split('/')[1] || 'index'
          // 如果用户没有创建layout组件时，渲染默认的layout组件
          const Layout = layout.component || DefaultLayout
          let Page = pages[pathname]
          // 当用户没有创建index页面时，渲染内部默认的indexPage页面
          if (pathname === 'index' && !Page) {
            Page = indexPage
          }
          const ctxValue = {
            activePage: pathname,
            ...props
          }
          return (
            <AppContext.Provider value={ctxValue}>
              <Layout {...ctxValue}>
                {Page ? (
                  <Suspense fallback={<Loading />}>
                    <Page {...ctxValue} />
                  </Suspense>
                ) : (
                  404
                )}
              </Layout>
            </AppContext.Provider>
          )
        }}
      />
    </Root>
  )
}
export default hot(App)
