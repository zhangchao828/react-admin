const fs = require('fs-extra')
const glob = require('glob')
const { extname } = require('path')
const { __pages, __routes, __routeModules } = require('@glcc/shared/paths')
const { isDev } = require('@glcc/shared/env')
const watchFiles = require('@glcc/shared/watchFiles')
const { debounce, camelCase } = require('lodash')
const { getConfig } = require('@glcc/shared/project')

const { lazyImport, federation, base } = getConfig()
const layoutId = '/layout'
const ignoreFileList = [
  /*
  需要被忽略不当做路由处理的文件或目录名
  component和components视作组件
  util和utils视作工具
  store视作mobx的store
  api和apis放接口
  */
  'store',
  'api',
  'apis',
  'utils',
  'util',
  'component',
  'components',
]
const with$Reg = /\[[0-9a-zA-Z_.]+\$]/g
const without$Reg = /\[[0-9a-zA-Z_.]+]/g

let lastContent = ``

function createRoutes() {
  watchRoutes()
  let files = glob.sync('**/*.*(js|jsx|tsx)', {
    cwd: __pages,
  })
  const { routes, routesMap, layouts, layoutsImport, routesImport } = getRoutes(files)
  const content = routes + layouts + layoutsImport + routesImport
  const changed = lastContent !== content
  if (changed) {
    lastContent = content
    fs.outputFileSync(
      __routes,
      `
${lazyImport ? `import { lazy } from 'react'` : ''}
import { Redirect } from '@glcc/admin'
${layoutsImport}
${routesImport}
export const routesMap = {
${routes}
}

export const layoutsMap = {
${layouts}
}
  `.trim()
    )
    if (federation.name) {
      const obj = Object.keys(routesMap)
        .filter((key) => !['/404', '/'].includes(key))
        .reduce((previousValue, currentValue) => {
          const key = currentValue.split('/').filter(Boolean)[0]
          return {
            ...previousValue,
            [key]: federation.name,
          }
        }, {})
      fs.outputFileSync(__routeModules, `export default ${JSON.stringify(obj)}`)
    } else {
      fs.outputFileSync(__routeModules, `export default {}`)
    }
  }
}

function getRoutes(files) {
  const pathsMap = {}
  const routesMap = {}
  const layoutsMap = {}
  const routes = []
  const routesImport = []
  const allLayouts = []
  const layoutsImport = []
  // 过滤路径,将files转为路径映射map
  files.forEach((item) => {
    let filePath = replaceIndex(item)
    filePath = `/${filePath === 'index' ? '' : filePath}`
    const routePath = becomeRoutePath(filePath)
    if (!ignorePath(routePath)) {
      // 过滤路径
      const realFilePath = `/${item}`
      if (isLayout(routePath)) {
        const layout = `@/src/pages${realFilePath}`
        const layoutChunkName = filePath.substring(1)
        const layoutPath = routePath.substring(0, routePath.indexOf(layoutId))
        layoutsMap[layoutPath] = true
        if (lazyImport) {
          allLayouts.push(
            `'${layoutPath}': lazy(() => import(/* webpackChunkName: "pages/${layoutChunkName}", webpackPrefetch: true */ '${layout}'))`
          )
        } else {
          const name = transform2importName(layoutPath, 'Layout')
          allLayouts.push(`'${layoutPath}': ${name}`)
          layoutsImport.push(`import ${name} from '${layout}'`)
        }
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
    const _routePath = routePath.replace(/\./g, '/')
    routesMap[_routePath] = {
      component: `@/src/pages${realFilePath}`,
      layouts: getLayouts(layoutsMap, routePath),
      filePath: filePath === '/' ? 'index' : filePath,
    }
  })
  // 拼接路由和layout
  if (!routesMap['/'] && routesMap[base]) {
    routesMap['/'] = {
      redirect: base,
    }
  }
  Object.keys(routesMap).forEach((routePath) => {
    const { component, layouts, redirect } = routesMap[routePath]
    const key = /\/\*/.test(routePath) ? routePath.replace(/\/\*/g, '*') : routePath
    if (redirect) {
      return routes.push(
        `
      '${key}':{
        component:<Redirect to="${redirect}"/>
      }
      `.trim()
      )
    }
    // 按照目录结构取webpackChunkName,使打包之后的目录结构更清晰
    const chunkName = component.substring(
      '@/src/pages'.length + 1,
      component.indexOf(extname(component))
    )
    if (lazyImport) {
      routes.push(
        `
  '${key}': {
     component: lazy(() => import(/* webpackChunkName: "pages/${chunkName}", webpackPrefetch: true */ '${component}')),
     layouts: ${JSON.stringify(layouts)}
  }`.trim()
      )
    } else {
      const name = transform2importName(key, 'Page')
      routes.push(`'${key}': { component: ${name},layouts: ${JSON.stringify(layouts)} }`)
      routesImport.push(`import ${name} from '${component}'`)
    }
  })
  return {
    routes: routes.join(',\n'),
    routesMap,
    routesImport: routesImport.join('\n'),
    layouts: allLayouts.join(',\n'),
    layoutsImport: layoutsImport.join('\n'),
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
function transform2importName(key, prefix) {
  const name = camelCase(key) || 'Index'
  return prefix + name[0].toUpperCase() + name.substring(1)
}
function becomeRoutePath(filePath) {
  if (filePath === '/') {
    return filePath
  }
  if (filePath === '/404') {
    return filePath
  }
  // filePath = filePath.replace(/\./g, '/')
  if (with$Reg.test(filePath)) {
    filePath = filePath.replace(with$Reg, (a) => {
      return a.replace('[', ':').replace('$]', '?')
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

function ignorePath(routePath = '') {
  if (!routePath) {
    return true
  }
  const routePathSplit = routePath.split('/').filter(Boolean)
  // 存在ignoreFileList里面列出的关键字的路径会被忽略
  if (ignoreFileList.some((item) => routePathSplit.includes(item))) {
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
  1: 首字母大写的文件或目录会被忽略，
  2: 动态路由[]包裹住的内容不能带有中划线 - 符号，这是因为react-router中的matchPath无法匹配
   */
  if (
    routePathSplit.find((item) => {
      if (isDynamicRoute(item)) {
        // 动态路由就三种情况 * 或者 :id 或者 :id?
        return item !== '*' && (item.includes('-') || item[1].toLowerCase() !== item[1])
      }
      return item[0].toLowerCase() !== item[0]
    })
  ) {
    return true
  }
  // 转为路由之后还存在. $ [ ] _符号的文件会被忽略
  return /[$\[\]_]/.test(routePath)
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
      debounce(createRoutes, 150)
    )
  }
}

module.exports = createRoutes
