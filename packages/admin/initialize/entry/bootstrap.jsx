import { Suspense, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Layout from '@/layout'
import Root from '@/index'
import { routesMap, layoutsMap } from '~admin/routes'
import { AppContext, wrapPage, matchPage } from '@zc/admin'
import ReactDOM from 'react-dom'

function Main() {
  const [data, setData] = useState({})
  const history = useHistory()
  const location = useLocation()
  const { pathname } = location
  const { Page, match, layouts } = matchPage(pathname, routesMap)
  const { params } = match || {}
  const wrappedPage = Page ? wrapPage(<Page params={params} />, { layouts, layoutsMap }) : null
  const contextValue = {
    params,
    location,
    history,
    data,
    setData(value) {
      setData(data === null ? {} : { ...data, ...value })
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
