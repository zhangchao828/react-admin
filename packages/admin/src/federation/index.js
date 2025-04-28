import { memo, useEffect, useMemo, useRef, useState, Suspense } from 'react'
import federationApps from '~admin/federation-apps'
import remoteRouteModules from '~admin/remote-route-modules'
import remoteComponents from '~admin/remote-components'
import { useAppContext } from '../app'
import { matchPage, wrapPage } from '../page'
import { layoutsMap, routesMap } from '~admin/routes'
import { getQuery, useRealPathname } from '../router'

export const Remote = memo(({ name, pathname, ...rest }) => {
  pathname = pathname || window.location.pathname
  const appContext = useAppContext()
  if (name) {
    const { component: App, layout } = federationApps[name]
    if (App) {
      return (
        <App
          pathname={pathname}
          {...rest}
          $$layout={layout}
          $$context={appContext}
          $$federation={name}
        />
      )
    }
  } else {
    const [moduleName, ...restPathname] = pathname.split('/').filter(Boolean)
    if (federationApps[moduleName]) {
      return <Remote name={moduleName} pathname={`/${restPathname.join('/')}`} {...rest} />
    }
    return (
      <RemoteModule
        pathname={pathname}
        {...rest}
        $$moduleName={moduleName}
        $$context={appContext}
      />
    )
  }
  return rest.children ?? null
})
function RemoteComponent({ name, is, ...rest }) {
  const [Component, setComponent] = useState()
  useEffect(() => {
    const getComponents = remoteComponents[name]
    if (getComponents) {
      getComponents()
        .then((components) => {
          const res = components[is]
          if (res) {
            setComponent(() => res)
          }
        })
        .catch((e) => {
          console.error('加载微前端组件失败', e)
        })
    }
  }, [name, is])
  if (Component) {
    return <Component {...rest} />
  }
  return null
}
function RemoteModule({ $$moduleName, ...rest }) {
  const [appName, setAppName] = useState()
  const ref = useRef(false)
  const findRemoteApp = async () => {
    /*
     依次去寻找匹配的模块属于哪一个微前端
     这里之所以这样异步去找，是因为如果某个微应用挂了，这里能catch到
     */
    for (let i = 0; i < remoteRouteModules.length; i++) {
      const appModules = await remoteRouteModules[i]().catch((e) => {
        console.error('加载微前端失败', e)
      })
      if (appModules?.default) {
        const name = appModules.default[$$moduleName]
        if (federationApps[name]) {
          ref.current = true
          return setAppName(name)
        }
      }
    }
  }
  useEffect(() => {
    findRemoteApp().then(() => {
      if (!ref.current) {
        setAppName(null)
      }
    })
  }, [ref, $$moduleName])
  if (appName === null) {
    return rest.children ?? null
  }
  if (appName) {
    const { component: App, layout } = federationApps[appName]
    return <App {...rest} $$federation={appName} $$layout={layout} />
  }
  return null
}

Remote.Component = RemoteComponent
export const Local = memo(({ pathname, fallback = null, ...props }) => {
  const pathSplit = pathname.split('?')
  pathname = useRealPathname(pathSplit[0])
  const search = pathSplit[1] || window.location.search
  const query = useMemo(() => {
    return search ? getQuery(null, search) : {}
  }, [search])
  const { Page, match, layouts } = useMemo(() => {
    return matchPage(pathname, routesMap)
  }, [pathname])
  const { params, path } = match
  return (
    <Suspense fallback={fallback}>
      {wrapPage(
        Page,
        layouts.map((name) => layoutsMap[name]),
        /**
         * 这几个属性会被传入每个page页面中，当keepalive时，这些属性也会被缓存
         */
        { params, query, path, pathname, props }
      )}
    </Suspense>
  )
})
