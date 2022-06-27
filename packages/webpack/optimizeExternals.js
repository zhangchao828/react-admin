const fs = require('fs-extra')
const { join } = require('path')
const { __root } = require('zs-shared/paths')
const { isDev } = require('zs-shared/env')
const { getConfig } = require('zs-shared/project')
const { getModuleVersionInNodeModules } = require('zs-shared/version')

const { externals, css } = getConfig()
const builtIn = {
  react: {
    global: 'React',
    script: isDev
      ? '/node_modules/react/umd/react.development.js'
      : '/node_modules/react/umd/react.production.min.js',
  },
  'react-dom': {
    global: 'ReactDOM',
    script: isDev
      ? '/node_modules/react-dom/umd/react-dom.development.js'
      : '/node_modules/react-dom/umd/react-dom.production.min.js',
  },
  // history: {
  //   global: 'HistoryLibrary',
  //   script: {
  //     development: '/node_modules/history/umd/history.development.js',
  //     production: '/node_modules/history/umd/history.production.min.js',
  //   },
  // },
  // 'react-router': {
  //   name: 'react-router',
  //   global: 'ReactRouter',
  //   script: {
  //     development: '/node_modules/react-router/umd/react-router.development.js',
  //     production: '/node_modules/react-router/umd/react-router.production.min.js',
  //   },
  // },
  'react-router-dom': {
    global: 'ReactRouterDOM',
    script: isDev
      ? '/node_modules/react-router-dom/umd/react-router-dom.js'
      : '/node_modules/react-router-dom/umd/react-router-dom.min.js',
  },
  mobx: {
    global: 'mobx',
    script: isDev
      ? '/node_modules/mobx/dist/mobx.umd.development.js'
      : '/node_modules/mobx/dist/mobx.umd.production.min.js',
  },
  'mobx-react-lite': {
    global: 'mobxReactLite',
    script: isDev
      ? '/node_modules/mobx-react-lite/dist/mobxreactlite.umd.development.js'
      : '/node_modules/mobx-react-lite/dist/mobxreactlite.umd.production.min.js',
  },
  axios: {
    global: 'axios',
    script: isDev ? '/node_modules/axios/dist/axios.js' : '/node_modules/axios/dist/axios.min.js',
  },
  moment: {
    global: 'moment',
    script: isDev ? '/node_modules/moment/moment.js' : '/node_modules/moment/min/moment.min.js',
  },
  'moment/locale/zh-cn': {
    global: 'moment.locale',
    script: '/node_modules/moment/locale/zh-cn.js',
  },
  antd: {
    global: 'antd',
    script: isDev ? '/node_modules/antd/dist/antd.js' : '/node_modules/antd/dist/antd.min.js',
  },
}

function optimizeScript(script, config) {
  const { outputPath, publicPath = '/' } = config || {}
  const prefix = '/node_modules'
  let src = script
  if (script.startsWith(prefix)) {
    const jsPath = join(__root, script)
    const copyPath = outputPath && join(outputPath, script)
    if (fs.pathExistsSync(jsPath)) {
      src = publicPath + script.substring(1)
      const moduleName = script.split('/').filter(Boolean)[1]
      const version = getModuleVersionInNodeModules(moduleName)
      if (version) {
        src += `?version=${version}`
      }
      if (!isDev && copyPath) {
        fs.copy(jsPath, copyPath)
      }
    } else {
      src = ''
      // error(`module not found: ${modulePath}`)
    }
  }
  return src
}

function optimizeCss(css, config) {
  if (typeof css === 'string') {
    let href = css
    const { outputPath, publicPath } = config || {}
    const prefix = '/node_modules'
    if (css.startsWith(prefix)) {
      const cssPath = join(__root, css)
      const copyPath = outputPath && join(outputPath, css)
      if (fs.pathExistsSync(cssPath)) {
        href = publicPath + css.substring(1)
        const moduleName = css.split('/').filter(Boolean)[1]
        const version = getModuleVersionInNodeModules(moduleName)
        if (version) {
          href += `?version=${version}`
        }
        if (!isDev && copyPath) {
          fs.copy(cssPath, copyPath)
        }
      } else {
        href = ''
      }
    }
    return href
  }
}

let optimizedExternals = null

function optimiseExternals(config) {
  if (optimizedExternals) {
    return optimizedExternals
  }
  const allExternals = {
    ...builtIn,
    ...externals,
  }
  const webpackExternals = {}
  const scripts = []
  Object.keys(allExternals).forEach((name) => {
    const obj = allExternals[name]
    if (obj) {
      const { global, script, async } = typeof obj === 'string' ? { script: obj } : obj
      const src = optimizeScript(script, config)
      if (src) {
        if (global) {
          webpackExternals[name] = global
        }
        scripts.push({ src, async })
      }
    }
  })
  const cssList = (css || []).map((item) => optimizeCss(item, config)).filter(Boolean)
  const res = {
    scripts,
    webpackExternals,
    css: cssList,
  }
  optimizedExternals = res
  return res
}
module.exports = optimiseExternals
