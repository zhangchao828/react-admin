import '~admin/public-path'
import Root from '@/index'
import Layout from '@/layout'
import ReactDOM from 'react-dom'
import event from '~admin/event'
import Router from '~admin/router'
import microApps from '~admin/micro-apps'
import { routesMap, layoutsMap } from '~admin/routes'
import { useHistory, useLocation } from 'react-router-dom'
import { AppContext, wrapPage, matchPage } from '@zc/admin'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'

function pathIncludes(path, target) {
  if (!target) {
    return false
  }
  path = path.split('/').filter(Boolean)
  target = target.split('/').filter(Boolean)
  if (target.length === 0 || path.length < target.length) {
    return false
  }
  return target.every((item, i) => item === path[i])
}
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
  let { Page, match, layouts } = useMemo(() => matchPage(pathname, routesMap), [pathname])
  const { params, path } = match
  const contextValue = {
    params,
    location,
    navigate,
    query,
    meta,
    setMeta,
  }
  let wrappedPage = wrapPage(
    Page,
    layouts.map((name) => layoutsMap[name]),
    { params, query }
  )
  const microApp = microApps.find((item) => pathIncludes(pathname, item.activeRule))
  if (microApp) {
    // 用来装载匹配到的qiankun微应用的容器
    wrappedPage = <div id={microApp.name} />
  }
  useEffect(() => {
    event.trigger(path, (module) => {
      const values = Object.keys(module).reduce((p, n) => ({ ...p, [n]: module[n] }), {})
      Root.onRouterChange?.(pathname, values)
    })
  }, [pathname])
  return (
    <AppContext.Provider value={contextValue}>
      <Layout location={location} match={match} microApp={microApp && microApp.name}>
        <Suspense fallback={null}>{wrappedPage}</Suspense>
      </Layout>
    </AppContext.Provider>
  )
}

function render(props) {
  const { container } = props
  ReactDOM.render(
    <Root>
      <Router>
        <Main />
      </Router>
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
