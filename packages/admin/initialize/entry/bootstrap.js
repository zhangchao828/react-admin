import Root from '@/src/index'
import Layout from '@/src/layout'
import { createRoot } from 'react-dom/client'
import { layoutsMap, routesMap } from '~admin/routes'
import { useHistory, useLocation, BrowserRouter, HashRouter } from 'react-router-dom'
import {
  AppContext,
  Remote,
  getQuery,
  matchPage,
  PageContext,
  wrapPage,
  HISTORY,
  useRealPathname,
} from '@glcc/admin'
import { Suspense, StrictMode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './app.css'

const { keepAlive, mode = 'browser' } = Root.config || {}
function Item({ children, id, match }) {
  /**
   * 每个页面都有一个PageContext包裹，因为id（即path）不一样
   * 所以每个页面中就可以通过唯一属性id去判断是否active
   */
  const value = useMemo(() => {
    return { id, active: match }
  }, [id, match])
  return (
    <PageContext.Provider value={value}>
      <div
        // className={match ? 'admin-route-item' : ''}
        style={{ height: '100%', display: match ? 'block' : 'none' }}
      >
        {children}
      </div>
    </PageContext.Provider>
  )
}
function MainEntry() {
  const [data, setData] = useState({})
  window[HISTORY] = useHistory()
  const [count, setCount] = useState(0)
  let { pathname, search } = useLocation()
  // 防止pathname最后带有/,并去掉base
  pathname = useRealPathname(pathname)
  const pagesRef = useRef({})
  const query = useMemo(() => {
    return search ? getQuery() : {}
  }, [search])
  const setAppData = useCallback((value) => {
    setData((prevState) => {
      return value === null ? {} : { ...prevState, ...value }
    })
  }, [])
  const { Page, match, layouts, is404 } = useMemo(() => {
    return matchPage(pathname, routesMap)
  }, [pathname])
  const { params, path } = match
  const url = pathname + search
  const cache = typeof keepAlive === 'function' ? keepAlive({ pathname }) : keepAlive
  /**
   * 当使用keepAlive的时候，业务代码中不能再用useParams，useLocation等和url相关的hooks
   * 因为他们是获取当前游览器地址的，是唯一的，而被缓存的页面如果不是当前激活页面，
   * 那获取的params或pathname和页面本身不匹配，这时就很有可能会导致逻辑错误
   * 但仍然可以从页面级组件的props上获取params，因为整个页面包括props都被缓存了
   * 这里之后维护修改的时候要特别小心，不然会影响业务，产生bug
   */
  /**
   * 根据pathname移除对应的缓存页面，外界主动调用，减少不必要的内存开销
   */
  const removeKeepAlive = useCallback(
    (p) => {
      p = Array.isArray(p) ? p : [p]
      const cachedKeys = Object.keys(pagesRef.current)
      if (cachedKeys.length) {
        p.forEach((item) => {
          const key = cachedKeys.find((i) => pagesRef.current[i].key === item)
          if (key) {
            delete pagesRef.current[key]
          }
        })
        setCount((c) => c + 1)
      }
    },
    [pagesRef]
  )
  const contextValue = useMemo(() => {
    return {
      data,
      setAppData,
      PageContext,
      removeKeepAlive,
      matchRoute: (p) => matchPage(p, routesMap)?.match || {},
    }
  }, [data])
  const getPageInstance = () => {
    const instance = pagesRef.current[path]
    if (instance && instance.key === url) {
      return instance.page
    }
    const res = wrapPage(
      Page,
      layouts.map((name) => layoutsMap[name]),
      /**
       * 这几个属性会被传入每个page页面中，当keepalive时，这些属性也会被缓存
       */
      { params, query, path, pathname, props: {} },
      url
    )
    // 没有匹配到就尝试渲染模块联邦
    if (is404) {
      return <Remote pathname={pathname}>{res}</Remote>
    }
    return res
  }
  const content = useMemo(() => {
    const instance = getPageInstance()
    if (instance) {
      // 当是404且pages文件夹下没有建立404路由时page会不存在
      pagesRef.current[path] = {
        page: instance,
        key: url,
        cache,
      }
    }
    return Object.keys(pagesRef.current).map((item) => {
      const { key, page } = pagesRef.current[item]
      if (path !== '/' && item !== path && item.includes(path)) {
        /**
           包含关系的路由只显示当前的一个，其他全部销毁，
           比如列表/list 跳转到详情页面/list/1，再回到/list
           由于/list/1包含/list，所以详情页面销毁
           TODO：
           这里存在一个隐含的小问题，就是包含关系用includes判断并不一定准确
           比如/home-list 包含 /home，但这两个路由并不是包含关系
           这种情况很少，暂时不处理
           */
        delete pagesRef.current[item]
        return null
      }
      /**
       * 注意这里判断是否匹配(match)是用pathname去匹配的，而不是用path去匹配，原因是因为
       * 动态路由时，path一样，但pathname并不一定一样，比如path为/home/:id时
       * pathname可能是/home/1，也可能是/home/2，此时不应该同时缓存这两个页面，
       * 必须要销毁其中一个，否则页面不会因为:id变化而重新渲染
       */
      return (
        <Item key={key} id={key} match={key === url}>
          {page}
        </Item>
      )
    })
  }, [url, count, cache, pagesRef])
  useEffect(() => {
    Object.keys(pagesRef.current).forEach((key) => {
      if (!pagesRef.current[key].cache) {
        delete pagesRef.current[key]
      }
    })
  })
  return (
    <AppContext value={contextValue}>
      <Layout pathname={pathname}>
        <Suspense fallback={null}>{content}</Suspense>
      </Layout>
    </AppContext>
  )
}

const content = (
  <Root>
    <MainEntry />
  </Root>
)
const Router = { browser: BrowserRouter, hash: HashRouter }[mode] || BrowserRouter
createRoot(document.getElementById('app')).render(
  <StrictMode>
    <Router>{content}</Router>
  </StrictMode>
)
