const { getEnv } = require('./env')
const { error } = require('./tip')
const { __src } = require('./getPath')
const lodash = require('lodash')
const glob = require('glob')
module.exports = function(inputPage) {
  let pages = []
  const blackList = ['__BASE__', 'static', 'env', 'base', 'src']
  const allPages = glob.sync('*', { cwd: __src }).filter(item => !blackList.includes(item))
  const { PAGE, ENV } = getEnv()
  if (PAGE && PAGE.trim()) {
    inputPage = PAGE
  }
  if (lodash.isString(inputPage)) {
    pages = inputPage.trim().replace(/[,|，、]/g, ',')
    // 逗号分隔
    const isMultiPage = inputPage.includes(',')
    if (isMultiPage) {
      pages = inputPage.split(',')
    } else {
      pages = [inputPage]
    }
  } else if (lodash.isArray(inputPage)) {
    pages = inputPage
  } else if (lodash.isFunction(inputPage)) {
    pages = inputPage(ENV)
  }
  if (!lodash.isArray(pages)) {
    pages = []
  }
  if (pages.includes('*')) {
    pages = allPages
  }
  pages = pages
    .filter(item => {
      // 不能以以下名字命名
      return item && lodash.isString(item) && allPages.includes(item.trim())
    })
    .map(item => item.trim())
  if (!pages.length) {
    error('page名称不合法')
  }
  return { allPages, pages, index: pages[0] }
}
