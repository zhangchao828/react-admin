const fs = require('fs-extra')
const { join } = require('path')
const { __root, __externals } = require('@glcc/shared/paths')
const { isDev } = require('@glcc/shared/env')
const { getConfig } = require('@glcc/shared/project')
const { getModuleVersionInNodeModules } = require('@glcc/shared/version')

let devExternals = []
if (fs.pathExistsSync(__externals)) {
  devExternals = require(__externals)
}
const { externals, css } = getConfig()
// 只有安装了才会被外部化
const builtIn = {
  // react: {
  //   global: 'React',
  //   script: `/node_modules/react/umd/react.${isDev ? 'development' : 'production.min'}.js`,
  // },
  // 'react-dom': {
  //   global: 'ReactDOM',
  //   script: `/node_modules/react-dom/umd/react-dom.${isDev ? 'development' : 'production.min'}.js`,
  // },
  // 'react-router-dom': {
  //   global: 'ReactRouterDOM',
  //   script: `/node_modules/react-router-dom/umd/react-router-dom${isDev ? '' : '.min'}.js`,
  // },
  // mobx: {
  //   global: 'mobx',
  //   script: `/node_modules/mobx/dist/mobx.umd.${isDev ? 'development' : 'production.min'}.js`,
  // },
  // 'mobx-react-lite': {
  //   global: 'mobxReactLite',
  //   script: `/node_modules/mobx-react-lite/dist/mobxreactlite.umd.${
  //     isDev ? 'development' : 'production.min'
  //   }.js`,
  // },
  axios: {
    global: 'axios',
    script: `/node_modules/axios/dist/${isDev ? 'axios' : 'axios.min'}.js`,
  },
  // moment: {
  //   global: 'moment',
  //   script: `/node_modules/moment/min/moment.min.js`,
  // },
  // 'moment/locale/zh-cn': {
  //   global: 'moment.locale',
  //   script: '/node_modules/moment/locale/zh-cn.js',
  // },
  // antd: {
  //   global: 'antd',
  //   script: `/node_modules/antd/dist/${isDev ? 'antd' : 'antd.min'}.js`,
  // },
  // echarts: {
  //   global: 'echarts',
  //   script: `/node_modules/echarts/dist/${isDev ? 'echarts' : 'echarts.min'}.js`,
  // },
  // 'echarts-gl': {
  //   global: 'window["echarts-gl"]',
  //   script: `/node_modules/echarts-gl/dist/${isDev ? 'echarts-gl' : 'echarts-gl.min'}.js`,
  // },
}

function optimizeScript({ name, script }, config) {
  if (!script) {
    return ''
  }
  const { outputPath, publicPath = '/' } = config || {}
  const prefix = '/node_modules'
  let src = script
  if (script.startsWith(prefix)) {
    const jsPath = join(__root, script)
    const copyPath = outputPath && join(outputPath, script)
    if (fs.pathExistsSync(jsPath)) {
      src = publicPath + script.substring(1)
      const sourceMap = jsPath + '.map'
      const version = getModuleVersionInNodeModules(name)
      if (version) {
        src += `?version=${version}`
      }
      if (!isDev && copyPath) {
        fs.copy(jsPath, copyPath)
        if (fs.pathExistsSync(sourceMap)) {
          fs.copy(sourceMap, copyPath + '.map')
        }
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
  const allExternals = externals && {
    ...builtIn,
    ...(isDev ? devExternals : {}),
    ...externals,
  }
  const webpackExternals = {}
  const scripts = []
  Object.keys(allExternals || {}).forEach((name) => {
    const obj = allExternals[name]
    if (obj) {
      const { global, script, async } = typeof obj === 'string' ? { script: obj } : obj
      const src = optimizeScript({ name, script }, config)
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
