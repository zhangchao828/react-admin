import '~admin/public-path'
import Root from '@/index'
import Layout from '@/layout'
import ReactDOM from 'react-dom'
import event from '~admin/event'
import MicroApp from '~admin/micro-apps'
import { routesMap, layoutsMap } from '~admin/routes'
import { useHistory, useLocation } from 'react-router-dom'
import { AppContext, wrapPage, matchPage, setMainApp, getQuery } from 'zs-admin'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'

if (!Root.config) {
  Root.config = {}
}
function Fallback() {
  return null
}
function Main() {
  const [meta, setAppMeta] = useState({})
  const history = useHistory()
  const location = useLocation()
  const { pathname, search } = location
  const query = useMemo(() => {
    return getQuery()
  }, [search])
  const setMeta = useCallback((value) => {
    setAppMeta((prevState) => {
      return value === null ? {} : { ...prevState, ...value }
    })
  }, [])
  let { Page, match, layouts, dir, is404 } = useMemo(
    () => matchPage(pathname, routesMap),
    [pathname]
  )
  const { params, path } = match
  const contextValue = {
    params,
    pathname,
    history,
    query,
    meta,
    setMeta,
    getMeta: () => meta,
  }
  let wrappedPage = wrapPage(
    Page,
    layouts.map((name) => layoutsMap[name]),
    { params, query, pathname, history }
  )
  if (is404 && MicroApp.list) {
    wrappedPage = <MicroApp pathname={pathname} />
  }
  useEffect(() => {
    event.trigger(path, (module) => {
      // const values = Object.keys(module).reduce((p, n) => ({ ...p, [n]: module[n] }), {})
      if (typeof module.title === 'string') {
        document.title = module.title
      }
    })
  }, [path])
  return (
    <AppContext.Provider value={contextValue}>
      <Layout pathname={pathname} dir={dir} isMicroApp={!!window.__POWERED_BY_QIANKUN__}>
        <Suspense fallback={<Fallback />}>{wrappedPage}</Suspense>
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
 * qiankun微应用所需生命周期配置
 */
if (!window.__POWERED_BY_QIANKUN__) {
  render({})
}
export async function bootstrap() {
  Root.config.microApp?.bootstrap?.()
}

export async function mount(props) {
  setMainApp({ history: props.history })
  Root.config.microApp?.mount?.(props)
  render(props)
}
export async function unmount(props) {
  Root.config.microApp?.unmount?.(props)
  const { container } = props
  ReactDOM.unmountComponentAtNode(
    container ? container.querySelector('#app') : document.querySelector('#app')
  )
}
window.qiankunLifecycle = {
  bootstrap,
  mount,
  unmount,
}
