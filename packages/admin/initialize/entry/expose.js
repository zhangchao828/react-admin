import { routesMap, layoutsMap } from '~admin/routes'
import { AppContext, wrapPage, matchPage, getQuery, useRealPathname } from '@zswl/admin'
import { useCallback, useMemo, useState, Suspense, lazy } from 'react'

const Root = lazy(() => import('@/src/index'))
const Layout = lazy(() => import('@/src/layout'))

function FederationEntry(props) {
  // props是父级模块联邦应用的传下来的属性
  let { pathname, $$layout, $$federation, $$context, ...otherProps } = props
  const [data, setData] = useState({})
  const pathSplit = pathname.split('?')
  pathname = useRealPathname(pathSplit[0])
  const search = pathSplit[1] || window.location.search
  const query = useMemo(() => {
    return search ? getQuery(null, search) : {}
  }, [search])
  const setAppData = useCallback((value) => {
    setData((prevState) => {
      return value === null ? {} : { ...prevState, ...value }
    })
  }, [])
  const { Page, match, layouts } = useMemo(() => matchPage(pathname, routesMap), [pathname])
  const { params, path } = match
  const wrappedPage = wrapPage(
    Page,
    layouts.map((name) => layoutsMap[name]),
    { params, query, path, pathname, props: otherProps }
  )
  const contextValue = useMemo(() => {
    return {
      data,
      setAppData,
      federation: $$federation,
      main: {
        context: $$context,
        ...otherProps,
      },
    }
  }, [data, props])
  if ($$layout) {
    return (
      <AppContext value={contextValue}>
        <Suspense fallback={null}>
          <Root>
            <Layout pathname={pathname}>
              <Suspense fallback={null}>{wrappedPage}</Suspense>
            </Layout>
          </Root>
        </Suspense>
      </AppContext>
    )
  }
  return (
    <AppContext value={contextValue}>
      <Suspense fallback={null}>{wrappedPage}</Suspense>
    </AppContext>
  )
}

export default FederationEntry
