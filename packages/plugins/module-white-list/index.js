const chalk = require('chalk')
const alias = require('@glcc/shared/alias')
const t = require('@babel/types')
const fs = require('fs-extra')
const { __packageJson, __whiteList } = require('@glcc/shared/paths')

const { devDependencies = {}, dependencies = {} } = require(__packageJson)
let modulesList = []
if (fs.pathExistsSync(__whiteList)) {
  modulesList = require(__whiteList)
}
const whiteList = Object.keys(alias).concat(modulesList)
function checkModule(path, value) {
  if (whiteList.includes('*')) {
    return
  }
  let moduleName = value
  if (moduleName.startsWith('.')) {
    return
  }
  if (!dependencies[value] && !devDependencies[value]) {
    return
  }
  if (moduleName.includes('?')) {
    moduleName = moduleName.substring(0, moduleName.indexOf('?'))
  }
  if (whiteList.includes(moduleName)) {
    return
  }
  const name = moduleName.split('/')[0]
  if (whiteList.includes(moduleName) || whiteList.includes(name)) {
    return
  }
  throw path.buildCodeFrameError(
    chalk.red(`\n模块 '${moduleName}' 不在白名单中，无法使用，请申请通过后才能使用`)
  )
}
module.exports = () => {
  return {
    visitor: {
      ImportDeclaration(path) {
        const { source } = path.node
        const { value } = source
        checkModule(path, value)
      },
      CallExpression(path) {
        const { node } = path
        if (t.isImport(node.callee) && node.arguments[0]) {
          const { value } = node.arguments[0]
          if (typeof value === 'string') {
            checkModule(path, value)
          }
        }
      },
    },
  }
}
