const { getConfig } = require('@zc/shared/project')
const fs = require('fs-extra')
const { __qiankun_microApps, __qiankun_publicPath } = require('@zc/shared/paths')
const message = require('@zc/shared/message')

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
        __qiankun_publicPath,
        `
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
}
      `
      )
    }
    if (Array.isArray(qiankun)) {
      const list = qiankun.map((item) => {
        if (!/^[A-Za-z]+$/.test(item.name)) {
          message.error(
            'qiankun: 定义成字符串时必须是大小写字母组成，不能包含空格、汉字、数字等特殊字符'
          )
        }
        return {
          ...item,
          container: `#${item.name}`,
          activeRule: `/${item.name}`,
        }
      })
      fs.outputFileSync(
        __qiankun_microApps,
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
