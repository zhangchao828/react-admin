const { isBuildMode, getEnv } = require('../tools/env')
const { __pages } = require('../paths')
const lodash = require('lodash')
const glob = require('glob')

module.exports = function(inputPage) {
  let pages = []
  const allPages = glob.sync('*', { cwd: __pages })
  if (isBuildMode()) {
    return {
      pages: allPages,
      watch: false
    }
  }
  const { PAGE } = getEnv()
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
  }
  if (!lodash.isArray(pages)) {
    return {
      pages: allPages,
      watch: false
    }
  }
  if (pages.includes('*')) {
    return {
      pages: allPages,
      watch: true
    }
  }
  pages = pages
    .filter(item => {
      // 不能以以下名字命名
      return item && lodash.isString(item) && allPages.includes(item.trim())
    })
    .map(item => item.trim())
  return {
    pages: pages.length ? pages : allPages,
    watch: !pages.length
  }
}
