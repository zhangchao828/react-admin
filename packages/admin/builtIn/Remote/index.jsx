import { useEffect, useState, memo, useRef, useMemo, useCallback } from 'react'
import { useAppContext } from '../AppContext'
import { wrapPage, matchPage } from '@zc/admin'
import remotes from '~admin/remotes'

function Remote(props) {
  const {
    location: { pathname },
  } = useAppContext()
  const remotesRef = useRef({})
  const { name, path = pathname, ...rest } = props
  const [, setCount] = useState(0)
  const forceUpdate = useCallback(() => {
    setCount((c) => c + 1)
  }, [])
  // 为了不让组件渲染两遍
  useMemo(() => {
    const savedRemote = remotesRef.current[name]
    if (savedRemote) {
      const matched = matchPage(path, savedRemote.routesMap)
      remotesRef.current[name] = {
        ...savedRemote,
        ...matched,
      }
      forceUpdate()
    }
  }, [name, path])
  useEffect(() => {
    if (!remotesRef.current[name]) {
      const remote = remotes[name]
      if (remote) {
        remote().then((res) => {
          const matched = matchPage(path, res.routesMap)
          remotesRef.current[name] = {
            ...matched,
            ...res,
          }
          forceUpdate()
        })
      } else {
        console.error(`微应用 '${name}' 未注册`)
      }
    }
  }, [name, path])
  const { Page, match = {}, layouts, layoutsMap } = remotesRef.current[name] || {}
  return Page
    ? wrapPage(<Page params={match.params} {...rest} />, {
        layouts,
        layoutsMap,
      })
    : null
}
export default memo(Remote)
