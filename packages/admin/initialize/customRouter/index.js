const fs = require('fs-extra')
const { join } = require('path')
const { extname } = require('path')
const { isDev } = require('@zc/shared/env')
const watchFiles = require('@zc/shared/watchFiles')
const getIndexPath = require('@zc/shared/getIndexPath')
const { __pages, __routes, __customRoutes } = require('@zc/shared/paths')

let lastContent = ``
function createRoutes() {
  watchRoutes()
  const customRoutesPath = join(__customRoutes, 'index.js')
  delete require.cache[require.resolve(customRoutesPath)]
  const routeConfig = require(customRoutesPath)
  if (routeConfig && routeConfig.length) {
    const { routes, layouts } = getRoutes(routeConfig)
    const content = routes + layouts
    const changed = lastContent !== content
    if (changed || !content) {
      lastContent = content
      fs.outputFileSync(
        __routes,
        `
import { lazy } from 'react'
import event from '~admin/event'

export const routesMap = {
${routes}
}
export const layoutsMap = {
${layouts}
}
  `.trim()
      )
    }
  } else {
    fs.outputFileSync(
      __routes,
      `
export const routesMap = {}
export const layoutsMap = {}
  `.trim()
    )
  }
}
function getRoutes(routeConfig) {
  const routesMap = {}
  const allLayouts = []
  const layoutsMap = {}
  const routes = []
  const loop = (list) => {
    list.forEach((item) => {
      let { path, component, children } = item
      path = '/' + path.split('/').filter(Boolean).join('/')
      component = '/' + component.split('/').filter(Boolean).join('/')
      const componentPath = getComponentPath(component)
      if (!componentPath) {
        return false
      }
      if (children && children.length) {
        layoutsMap[path] = true
        const layoutChunkName = path.substring(1)
        allLayouts.push(
          `'${path}': lazy(() => import(/* webpackChunkName: "${layoutChunkName}", webpackPrefetch: true */ '${componentPath}'))`
        )
        loop(children)
      } else {
        routesMap[path] = {
          component: componentPath,
          layouts: getLayouts(layoutsMap, path),
        }
      }
    })
  }
  loop(routeConfig)
  Object.keys(routesMap).forEach((routePath) => {
    const { component, layouts } = routesMap[routePath]
    // 按照目录结构取webpackChunkName,使打包之后的目录结构更清晰
    const chunkName = component.substring(
      '@/pages'.length + 1,
      component.indexOf(extname(component))
    )
    const route = `
    '${routePath}': {
        component: lazy(() => import(/* webpackChunkName: "${chunkName}", webpackPrefetch: true */ '${component}').then(res=> {
          event.resolve('${routePath}', res.default)
          return res
        })
      ), 
      layouts: ${JSON.stringify(layouts)}
     }`
    routes.push(route)
  })
  return {
    routes: routes.join(',\n'),
    layouts: allLayouts.join(',\n'),
  }
}
function getLayouts(layoutsMap, routePath) {
  const layouts = []
  const list = routePath.split('/').slice(1)
  list.reduce((prev, current) => {
    const path = prev + '/' + current
    if (layoutsMap[path]) {
      layouts.push(path)
    }
    return path
  }, '')
  return layouts
}
function getComponentPath(component, ext) {
  if (!component) {
    return null
  }
  const filePath = component + ext || ''
  if (extname(filePath)) {
    const exists = fs.pathExistsSync(join(__pages, filePath))
    return exists ? `@/pages${filePath}` : null
  }
  const jsPath = getComponentPath(component, '.js')
  if (jsPath) {
    return jsPath
  }
  const jsxPath = getComponentPath(component, '.jsx')
  if (jsxPath) {
    return jsxPath
  }
  const tsxPath = getComponentPath(component, '.tsx')
  if (tsxPath) {
    return tsxPath
  }
  const componentIndex = getIndexPath(join(__pages, component))
  if (componentIndex) {
    return getComponentPath(component, '/index' + extname(componentIndex))
  }
  return null
}

let watched = false
function watchRoutes() {
  if (!watched && isDev) {
    watched = true
    watchFiles(
      ['**/*.js'],
      {
        cwd: __customRoutes,
        event: 'all',
      },
      (m, p) => {
        if (m === 'change') {
          delete require.cache[require.resolve(join(__customRoutes, p))]
        }
        createRoutes()
      }
    )
  }
}

module.exports = createRoutes
