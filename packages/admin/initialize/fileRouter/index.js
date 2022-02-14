const fs = require('fs-extra')
const glob = require('glob')
const { extname } = require('path')
const { __pages, __routes } = require('@zc/dev-utils/paths')
const { isDev } = require('@zc/dev-utils/env')
const watchFiles = require('@zc/dev-utils/watchFiles')
const { getConfig } = require('@zc/dev-utils/project')
const { ignore: ignoreFileNames } = getConfig().useFileRouter

const layoutId = '/layout'
const ignoreFileList = [
  /*
  需要被忽略不当做路由处理的文件或目录名
  component和components视作组件
  util和utils视作工具
  store视作mobx的store
  api和apis放接口
  test被视作测试文件
  common和commons通用文件
  column和columns表格的表头文件
  */
  'store',
  'api',
  'apis',
  'utils',
  'util',
  'component',
  'components',
  'test',
  'tests',
  'common',
  'commons',
  'column',
  'columns',
].concat(ignoreFileNames || [])
const with$Reg = /\[[0-9a-zA-Z_.]+\$]/g
const without$Reg = /\[[0-9a-zA-Z_.]+]/g

let lastContent = ``
function createRoutes() {
  watchRoutes()
  const files = glob.sync('**/*.*(js|jsx|tsx)', {
    cwd: __pages,
  })
  const { routes, layouts } = getRoutes(files)
  const content = routes + layouts
  const changed = lastContent !== content
  if (changed) {
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
}

function getRoutes(files) {
  const pathsMap = {}
  const routesMap = {}
  const layoutsMap = {}
  const routes = []
  const allLayouts = []
  // 过滤路径,将files转为路径映射map
  files.forEach((item) => {
    let filePath = replaceIndex(item)
    filePath = `/${filePath === 'index' ? '' : filePath}`
    const routePath = becomeRoutePath(filePath)
    if (!ignorePath(routePath)) {
      // 过滤路径
      const realFilePath = `/${item}`
      if (isLayout(routePath)) {
        const layout = `@/pages${realFilePath}`
        const layoutChunkName = filePath.substring(1)
        const layoutPath = routePath.substring(0, routePath.indexOf(layoutId))
        layoutsMap[layoutPath] = true
        allLayouts.push(
          `'${layoutPath}': lazy(() => import(/* webpackChunkName: "${layoutChunkName}", webpackPrefetch: true */ '${layout}'))`
        )
      } else {
        pathsMap[filePath] = {
          realFilePath,
          routePath,
        }
      }
    }
  })
  // 将路径转为路由映射
  Object.keys(pathsMap).forEach((filePath) => {
    const { routePath, realFilePath } = pathsMap[filePath]
    routesMap[routePath] = {
      component: `@/pages${realFilePath}`,
      layouts: getLayouts(layoutsMap, routePath),
    }
  })
  // 拼接路由和layout
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
function isLayout(filePath) {
  return filePath && filePath.endsWith(layoutId)
}
function replaceIndex(str) {
  return str && str.replace(/(\/index)?\.[jt]sx?/g, '')
}
function becomeRoutePath(filePath) {
  if (filePath === '/') {
    return filePath
  }
  if (with$Reg.test(filePath)) {
    filePath = filePath.replace(with$Reg, (a) => {
      return a.replace('[...]', '*').replace('[', ':').replace('$]', '?')
    })
  }
  if (without$Reg.test(filePath)) {
    filePath = filePath.replace(without$Reg, (a) => {
      return a.replace('[...]', '*').replace('[', ':').replace(']', '')
    })
  }
  return filePath
}
function isDynamicRoute(routePath) {
  return routePath && (routePath.includes('*') || routePath.includes(':'))
}
function ignorePath(routePath = '', extraIgnore = []) {
  if (!routePath) {
    return true
  }
  const ignoreList = ignoreFileList.concat(extraIgnore || [])
  // 微服务打包时可能会排除pages/index
  if (routePath === '/' && ignoreList.includes('index')) {
    return true
  }
  const routePathList = routePath.split('/').filter(Boolean)
  // 存在ignoreFileList里面列出的关键字的路径会被忽略
  if (ignoreList.some((item) => routePathList.includes(item))) {
    return true
  }
  // pages/index下的路径会被忽略
  if (routePath.indexOf('/index') === 0) {
    return true
  }
  // /layout下的路径被忽略
  if (routePath.includes(`${layoutId}/`)) {
    return true
  }
  // /[...]下的路径被忽略
  if (routePath.includes(`*/`)) {
    return true
  }
  /*
  1: 非动态路由带有大写字母的文件或目录会被忽略，
  2: 动态路由[]包裹住的内容可以有大写字母
  3: 动态路由[]包裹住的内容不能带有中划线 - 符号，这是因为react-router中的matchPath无法匹配
   */
  if (routePathList.find((item) => !isDynamicRoute(item) && item.toLowerCase() !== item)) {
    return true
  }
  // 转为路由之后还存在. $ [ ] _符号的文件会被忽略
  return /[.$\[\]_]/.test(routePath)
}

let hasWatched = false
function watchRoutes() {
  if (isDev && !hasWatched) {
    hasWatched = true
    watchFiles(
      ['**/*.js', '**/*.jsx', '**/*.tsx'],
      {
        cwd: __pages,
      },
      createRoutes
    )
  }
}

module.exports = createRoutes
