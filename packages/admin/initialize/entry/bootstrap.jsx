import { Suspense, useCallback, useMemo, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Layout from '@/layout'
import Root from '@/index'
import { routesMap, layoutsMap } from '~admin/routes'
import { AppContext, wrapPage, matchPage } from '@zc/admin'
import ReactDOM from 'react-dom'

const cachedPages = {}
function Main() {
  const [meta, setAppMeta] = useState({})
  const history = useHistory()
  const location = useLocation()
  const { pathname, search } = location
  const { Page, match, layouts } = matchPage(pathname, routesMap)
  const { params, path } = match || {}
  const wrappedPage = Page ? wrapPage(<Page params={params} />, { layouts, layoutsMap }) : null
  // if (path) {
  //   cachedPages[path] = wrappedPage
  // }
  // const pageList = Object.keys(cachedPages).map((p) => {
  //   const item = cachedPages[p]
  //   return (
  //     <div key={p} style={{ display: p === path ? 'block' : 'none' }}>
  //       {item}
  //     </div>
  //   )
  // })
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
  const contextValue = {
    params,
    location,
    navigate,
    query,
    meta,
    setMeta,
  }
  return (
    <AppContext.Provider value={contextValue}>
      <Layout location={location} match={match}>
        <Suspense fallback={null}>{wrappedPage}</Suspense>
      </Layout>
    </AppContext.Provider>
  )
}

ReactDOM.render(
  <Root>
    <Main />
  </Root>,
  document.getElementById('app')
)
