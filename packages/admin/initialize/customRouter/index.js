const { __pages, __localConfig, __projectConfig, __routes } = require('@zc/dev-utils/paths')
const { extname } = require('path')
const getIndexPath = require('../getIndexPath')
const fs = require('fs-extra')
const { join } = require('path')
const { isDev } = require('@zc/dev-utils/env')
const project = require('@zc/dev-utils/project')
const watchFiles = require('@zc/dev-utils/watchFiles')

let lastContent = ``
function createRoutes() {
  watchRoutes()
  const { routes: routeConfig } = project.getConfig()
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
    const _layouts = JSON.stringify(layouts)
    const _component = `lazy(() => import(/* webpackChunkName: "${chunkName}", webpackPrefetch: true */ '${component}'))`
    const route = `'${routePath}': { component: ${_component}, layouts: ${_layouts}}`
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
function reCreate() {
  project.initConfig()
  createRoutes()
}
function watchRoutes() {
  if (!watched && isDev) {
    watched = true
    watchFiles(
      [__projectConfig, __localConfig],
      {
        event: ['all'],
      },
      reCreate
    )
  }
}

module.exports = createRoutes
