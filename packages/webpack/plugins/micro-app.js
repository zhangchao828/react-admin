const { getConfig } = require('zs-shared/project')
const fs = require('fs-extra')
const { __microApps, __publicPath } = require('zs-shared/paths')

const { microApp } = getConfig()

/**
 * 关于乾坤微应用如何部署参考以下链接，尤其注意主应用和微应用部署在同一个服务下
 * https://qiankun.umijs.org/zh/cookbook#%E5%A6%82%E4%BD%95%E9%83%A8%E7%BD%B2
 */
class MicroAppPlugin {
  apply(compiler) {
    if (typeof microApp === 'string') {
      compiler.options.output = {
        ...compiler.options.output,
        library: {
          name: microApp,
          type: 'var',
        },
        libraryTarget: 'umd',
        jsonpFunction: `webpackJsonp_${microApp}`,
        globalObject: 'window',
      }
      fs.outputFileSync(
        __publicPath,
        `
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
}
      `
      )
    }
    if (Array.isArray(microApp)) {
      fs.outputFileSync(
        __microApps,
        `
import { loadMicroApp, start } from 'qiankun'
import { useEffect, useRef, useMemo } from 'react'
import { useHistory } from 'react-router-dom'

const list = ${JSON.stringify(microApp, null, 2)}

start()
function pathIncludes(path, target) {
  if (!target) {
    return false
  }
  path = path.split('/').filter(Boolean)
  target = target.split('/').filter(Boolean)
  if (target.length === 0 || path.length < target.length) {
    return false
  }
  return target.every((item, i) => item === path[i])
}
function MicroApp({ pathname }) {
  const ref = useRef()
  const history = useHistory()
  const { name, entry, credentials } = useMemo(() => {
    return list.find((item) => pathIncludes(pathname, item.activeRule)) || {}
  }, [pathname])
  useEffect(() => {
    if (name && entry) {
      const microApp = loadMicroApp(
        {
          name,
          entry,
          container: ref.current,
          props: {
            history,
          },
        },
        {
          singular: true,
          fetch(url, ...args) {
            if (credentials) {
              return window.fetch(url, {
                ...args,
                mode: 'cors',
                credentials: 'include',
              })
            }

            return window.fetch(url, ...args)
          },
        }
      )
      return () => microApp.unmount()
    }
  }, [name])
  return <div ref={ref}></div>
}
MicroApp.list = list

export default MicroApp
      `
      )
    }
  }
}

module.exports = MicroAppPlugin
