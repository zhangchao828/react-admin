const isPlainObject = require('lodash/isPlainObject')
const fs = require('fs-extra')
const { join } = require('path')
const { __root } = require('@zc/dev-utils/paths')
const { isDev } = require('@zc/dev-utils/env')
const { getConfig } = require('@zc/dev-utils/project')

const {
  useFileRouter,
  webpack: { externals, builtInExternals },
} = getConfig()
const builtInLib = {
  react: [
    {
      name: 'react',
      global: 'React',
      script: {
        development: '/node_modules/react/umd/react.development.js',
        production: '/node_modules/react/umd/react.production.min.js',
      },
    },
    {
      name: 'react-dom',
      global: 'ReactDOM',
      script: {
        development: '/node_modules/react-dom/umd/react-dom.development.js',
        production: '/node_modules/react-dom/umd/react-dom.production.min.js',
      },
    },
  ],
  reactRouter: [
    // {
    //   name: 'history',
    //   global: 'HistoryLibrary',
    //   script: {
    //     development: '/node_modules/history/umd/history.development.js',
    //     production: '/node_modules/history/umd/history.production.min.js',
    //   },
    // },
    // {
    //   name: 'react-router',
    //   global: 'ReactRouter',
    //   script: {
    //     development: '/node_modules/react-router/umd/react-router.development.js',
    //     production: '/node_modules/react-router/umd/react-router.production.min.js',
    //   },
    // },
    {
      name: 'react-router-dom',
      global: 'ReactRouterDOM',
      script: {
        development: '/node_modules/react-router-dom/umd/react-router-dom.js',
        production: '/node_modules/react-router-dom/umd/react-router-dom.min.js',
      },
    },
  ],
  mobx: [
    {
      name: 'mobx',
      global: 'mobx',
      script: {
        development: '/node_modules/mobx/dist/mobx.umd.development.js',
        production: '/node_modules/mobx/dist/mobx.umd.production.min.js',
      },
    },
    {
      name: 'mobx-react-lite',
      global: 'mobxReactLite',
      script: {
        development: '/node_modules/mobx-react-lite/dist/mobxreactlite.umd.development.js',
        production: '/node_modules/mobx-react-lite/dist/mobxreactlite.umd.production.min.js',
      },
    },
  ],
  axios: [
    {
      name: 'axios',
      global: 'axios',
      script: {
        development: '/node_modules/axios/dist/axios.js',
        production: '/node_modules/axios/dist/axios.min.js',
      },
    },
  ],
}

function getExternals() {
  if (!builtInExternals) {
    return []
  }
  let extraExternals = []
  if (useFileRouter && builtInExternals.reactRouter === undefined) {
    builtInExternals.reactRouter = true
  }
  Object.keys(builtInLib).forEach((name) => {
    if (builtInExternals[name]) {
      extraExternals = extraExternals.concat(builtInLib[name])
    }
  })
  return [...extraExternals, ...externals]
}

function optimizeScript(script, config) {
  const { outputPath, publicPath = '/', devOnly } = config || {}
  const res = {}
  if (!isDev && devOnly) {
    return {}
  }
  if (typeof script === 'string') {
    res.src = script
  } else if (isPlainObject(script)) {
    const { development, production, async } = script
    res.src = isDev ? development : production
    res.async = async
  }
  if (!res.src) {
    return {}
  }
  const prefix = '/node_modules'
  const { src } = res
  if (src.startsWith(prefix)) {
    const modulePath = join(__root, src)
    const copyPath = outputPath && join(outputPath, src)
    res.src = publicPath + src.substring(1)
    if (fs.pathExistsSync(modulePath)) {
      if (!isDev && copyPath) {
        fs.copy(modulePath, copyPath)
      }
    } else {
      // error(`module not found: ${modulePath}`)
    }
  }
  return res
}
let optimizedExternals = null

function optimiseExternals(config) {
  if (optimizedExternals) {
    return optimizedExternals
  }
  const resExternals = getExternals()
  const externalsMap = {}
  const scripts = {}
  resExternals.forEach((item) => {
    const { name, global, script, devOnly } = typeof item === 'string' ? { script: item } : item
    const { src, async } = optimizeScript(script, { ...config, devOnly })
    if (!isDev && devOnly) {
      // do nothing
    } else {
      if (name && !externalsMap[name]) {
        externalsMap[name] = global
      }
      if (src && !scripts[src]) {
        scripts[src] = { async }
      }
    }
  })
  const res = {
    scripts: Object.keys(scripts).map((src) => ({
      src,
      async: scripts[src].async,
    })),
    externals: externalsMap,
  }
  optimizedExternals = res
  return res
}
module.exports = optimiseExternals
