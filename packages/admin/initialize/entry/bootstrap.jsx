import '~admin/qiankun-public-path'
import { Suspense, useCallback, useMemo, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Layout from '@/layout'
import Root from '@/index'
import { routesMap, layoutsMap } from '~admin/routes'
import { AppContext, wrapPage, matchPage } from '@zc/admin'
import ReactDOM from 'react-dom'
import '~admin/qiankun-micro-apps'

function Main() {
  const [meta, setAppMeta] = useState({})
  const history = useHistory()
  const location = useLocation()
  const { pathname, search } = location
  const query = useMemo(() => {
    return new URLSearchParams(search)
  }, [search])
  const navigate = useCallback(
    (to, props) => {
      if (typeof to === 'number') {
        if (to === 1) {
          return history.goForward()
        }
        if (to === -1) {
          return history.goBack()
        }
        history.go(to)
      } else {
        const { replace, state } = props || {}
        if (replace) {
          history.replace(to, state)
        } else {
          history.push(to, state)
        }
      }
    },
    [history]
  )
  const setMeta = useCallback((value) => {
    setAppMeta((prevState) => {
      return value === null ? {} : { ...prevState, ...value }
    })
  }, [])
  const { Page, match, layouts } = matchPage(pathname, routesMap)
  const { params } = match
  const contextValue = {
    params,
    location,
    navigate,
    query,
    meta,
    setMeta,
  }
  const wrappedPage = wrapPage(
    Page,
    layouts.map((name) => layoutsMap[name]),
    { params, query }
  )
  return (
    <AppContext.Provider value={contextValue}>
      <Layout location={location} match={match}>
        <Suspense fallback={null}>{wrappedPage}</Suspense>
      </Layout>
    </AppContext.Provider>
  )
}

function render(props) {
  const { container } = props
  ReactDOM.render(
    <Root>
      <Main />
    </Root>,
    container ? container.querySelector('#app') : document.querySelector('#app')
  )
}

/**
 * qiankun所需配置
 */
if (!window.__POWERED_BY_QIANKUN__) {
  render({})
}

export async function bootstrap() {
  Root.qiankun?.bootstrap?.()
}

export async function mount(props) {
  render(props)
}

export async function unmount(props) {
  const { container } = props
  ReactDOM.unmountComponentAtNode(
    container ? container.querySelector('#app') : document.querySelector('#app')
  )
}
