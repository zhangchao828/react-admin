import { matchPath } from 'react-router-dom'
import { useContext, Suspense, createContext, isValidElement } from 'react'
import { useAppContext } from '../app'

function getPathSplitLen(path) {
  // 获取路径按照符号 / 分割的长度
  return path ? path.split('/').length : 0
}
function getLoopIncluded(list, pathname) {
  /*
  能到达这里的路由，一般都是比较特殊的路由，大部分情况是不会调用此方法的
  递归删选具有包含关系的相似路由，如果获取到的有多个，那么取路径最短的那个，例：
  匹配到的多个路由为['/home/detail/:id?','/home/:id?/:name?','/home/detail/:id?/:name?']
  当前pathname为/home/detail/1 ,用react-router的matchPath方法都能匹配上
  1：经过第一次filter之后没有找到匹配的
  2：将pathname截掉最后一个/后的内容变为/home/detail,再继续调用getLoopIncluded
  3：此时pathname为/home/detail，经过filter之后，匹配到两项['/home/detail/:id?','/home/detail/:id?/:name?']
  4:将匹配到的两项经过按/切分后取最短的，/home/detail/:id?切分后为3，/home/detail/:id?/:name?切分后为4，
  所以最后取/home/detail/:id?为最匹配的路由
   */
  if (!pathname) {
    return null
  }
  const included = list.filter((item) => {
    return item.path.indexOf(pathname) === 0
  })
  if (included.length === 0) {
    pathname = pathname.substring(0, pathname.lastIndexOf('/'))
    return getLoopIncluded(list, pathname)
  }
  if (included.length === 1) {
    return included[0]
  }
  included.sort((a, b) => getPathSplitLen(a.path) - getPathSplitLen(b.path))
  return included[0]
}
function getMostSimilarRoute(matchedRoutes, pathname) {
  // 取相似度最高的路由
  if (!matchedRoutes || matchedRoutes.length === 0) {
    return null
  }
  if (matchedRoutes.length === 1) {
    return matchedRoutes[0]
  }
  return getLoopIncluded(matchedRoutes, pathname)
}
export function findRoute(pathname, routes) {
  let route = null
  const matchedRoutes = []
  const routeKeys = Object.keys(routes)
  if (!routeKeys.length) {
    return null
  }
  routeKeys.forEach((path) => {
    // 只有动态路由才去匹配
    if (path.includes(':') || path.includes('*')) {
      const item = matchPath(pathname, {
        path,
        exact: true,
        strict: false,
      })
      if (item) {
        matchedRoutes.push(item)
      }
    }
  })
  // 如果匹配到多个路由，取相似度最高的
  const match = getMostSimilarRoute(matchedRoutes, pathname)
  if (match) {
    route = routes[match.path]
  }
  return route && { match, ...route }
}

export function wrapPage(Page, layouts, props, key) {
  // 这里给Page加key是因为让相同的path不同的pathname时，页面也销毁重渲染
  const page = isValidElement(Page) ? Page : Page && <Page key={key} {...props} />
  // 递归嵌套layout将Page包裹住
  function wrapContent(index = 0) {
    const Layout = layouts[index]
    if (Layout) {
      return (
        <Suspense fallback={null}>
          <Layout {...props}>{wrapContent(index + 1)}</Layout>
        </Suspense>
      )
    } else {
      return page ?? null
    }
  }
  return wrapContent()
}

/*
 缓存已经访问过的路由页面，无需再次去匹配路径，提升性能，
 最大缓存100个，避免内存太多
 */
const cache = {}
let cacheCount = 0
export function matchPage(pathname, routesMap) {
  if (cache[pathname]) {
    return cache[pathname]
  }
  const route = routesMap[pathname] || findRoute(pathname, routesMap)
  const defaultMatch = { path: pathname, url: pathname, params: {} }
  const { component: page, match, layouts = [] } = route || {}
  const { component: page404 } = routesMap['/404'] || {}
  const res = {
    Page: page || page404,
    match: { ...defaultMatch, ...match },
    layouts,
    is404: !route,
  }
  if (cacheCount < 100) {
    cacheCount++
    cache[pathname] = res
  }
  return res
}

/**
 * keepAlive时，用来判断页面是否激活
 */
export const PageContext = createContext({ id: null, active: null })
export function useActive() {
  const { main } = useAppContext()
  // 当是子应用的时候，PageContext使用主应用的，因为PageContext是在主应用提供的
  const { active } = useContext(main?.context.PageContext || PageContext)
  return active
}
