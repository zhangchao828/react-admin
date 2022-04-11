import { Suspense, useMemo, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Layout from '@/layout'
import Root from '@/index'
import { routesMap, layoutsMap } from '~admin/routes'
import { AppContext, wrapPage, matchPage } from '@zc/admin'
import ReactDOM from 'react-dom'

function Main() {
  const [meta, setMeta] = useState({})
  const history = useHistory()
  const location = useLocation()
  const { pathname, search } = location
  const { Page, match, layouts } = matchPage(pathname, routesMap)
  const { params } = match || {}
  const wrappedPage = Page ? wrapPage(<Page params={params} />, { layouts, layoutsMap }) : null
  const query = useMemo(() => {
    return new URLSearchParams(search)
  }, [search])
  const navigate = useMemo(() => {
    return (to, props) => {
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
    }
  }, [history])
  const contextValue = {
    params,
    location,
    navigate,
    query,
    meta,
    setMeta(value) {
      setMeta(value === null ? {} : { ...meta, ...value })
    },
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
