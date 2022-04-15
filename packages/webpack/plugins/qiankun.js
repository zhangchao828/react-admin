const { getConfig } = require('@zc/shared/project')
const fs = require('fs-extra')
const { __microApps, __publicPath } = require('@zc/shared/paths')

const { qiankun } = getConfig()
class QiankunPlugin {
  apply(compiler) {
    if (typeof qiankun === 'string') {
      compiler.options.output = {
        ...compiler.options.output,
        library: {
          name: qiankun,
          type: 'var',
        },
        libraryTarget: 'umd',
        jsonpFunction: `webpackJsonp_${qiankun}`,
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
    if (Array.isArray(qiankun)) {
      const list = qiankun.map((item) => {
        return {
          ...item,
          container: `#${item.name}`,
          activeRule: `/${item.name}`,
        }
      })
      fs.outputFileSync(
        __microApps,
        `
import { registerMicroApps, start } from 'qiankun'

const microApps = ${JSON.stringify(list)}
registerMicroApps(microApps)
start()

export default microApps
      `
      )
    }
  }
}

module.exports = QiankunPlugin
