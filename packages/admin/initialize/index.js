const createRoot = require('./root')
const createEntry = require('./entry')
const createFileRouter = require('./fileRouter')
const initExtra = require('./extra')
const { isDev } = require('@zswl/shared/env')
const pkgManager = require('@zswl/shared/pkgManager')
const { __temporary, __src } = require('@zswl/shared/paths')
const fs = require('fs-extra')
const glob = require('glob')
const { error } = require('@zswl/shared/message')

// 检查src目录下是否存在不合规的一级目录或文件
function checkSrcDir() {
  const dir = [
    'api',
    'pages',
    'components',
    'layout',
    'utils',
    'index.js',
    'index.tsx',
    'index.jsx',
    'app.less',
  ]
  const files = glob.sync('*', {
    cwd: __src,
  })
  const match = files.find((item) => !dir.includes(item))
  if (match) {
    error(`src/${match} 文件或目录不应该存在于src目录下
  - 如果是通用方法请放在utils目录下
  - 如果是通用组件请放在components目录下
  - 如果觉得是有必要存在的请联系管理员添加
    `)
  }
}

module.exports = async function initialize() {
  pkgManager.hasNewDep()
  checkSrcDir()
  fs.emptyDirSync(__temporary)
  createRoot()
  createEntry()
  await initExtra()
  createFileRouter()
  if (isDev) {
    require('@zswl/shared/mock').init()
  }
}
