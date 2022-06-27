import Root from '@/index'
import Layout from '@/layout'
import { routesMap, layoutsMap } from '~admin/routes'
import { AppContext, wrapPage, matchPage } from 'zs-admin'
import { Suspense, useCallback, useMemo, useState } from 'react'

function Main(props) {
  const { pathname, history, query, federation, ...rest } = props
  const [meta, setAppMeta] = useState({})
  const setMeta = useCallback((value) => {
    setAppMeta((prevState) => {
      return value === null ? {} : { ...prevState, ...value }
    })
  }, [])
  let { Page, match, layouts, dir } = useMemo(() => matchPage(pathname, routesMap), [pathname])
  const { params } = match
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
    { params, query, pathname, history, federation }
  )
  return (
    <AppContext.Provider value={contextValue}>
      <Layout pathname={pathname} dir={dir} federation={federation} {...rest}>
        <Suspense fallback={null}>{wrappedPage}</Suspense>
      </Layout>
    </AppContext.Provider>
  )
}

export default function (props) {
  return (
    <Root {...props}>
      <Main {...props} />
    </Root>
  )
}
