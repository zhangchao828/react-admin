/**
 * 根据pages下的目录创建对应的页面和一级路由之间的映射关系
 */
const { __pages, __layout, __src } = require('../paths')
const { join } = require('path')
const fs = require('fs-extra')
const glob = require('glob')
const chokidar = require('chokidar')
const { isBuildMode } = require('../tools/env')
const getIndexPath = require('./getIndexPath')
const getPages = require('./getPages')
const { page } = require('./getHljConfig')()

const { pages, watch } = getPages(page)
function createLayout() {
  let importLayout = ''
  let exportLayout = 'export const layout = {}'
  if (fs.pathExistsSync(__layout)) {
    importLayout = `import Layout from '@layout'`
    exportLayout = 'export const layout = { component: Layout }'
  }
  return {
    importLayout,
    exportLayout
  }
}
function createRoot() {
  const rootPath = getIndexPath(__src)
  let importRoot = ''
  let exportRoot = 'export const root = {}'
  if (rootPath) {
    importRoot = `import Root from '@src'`
    exportRoot = 'export const root = { component: Root }'
  }
  return {
    importRoot,
    exportRoot
  }
}
function createPages() {
  const pagesStr = (watch ? glob.sync('*', { cwd: __pages }) : pages)
    .map(item => {
      return `'${item}': lazy(() => import('@pages/${item}'))`
    })
    .join(',\n')
  return `export const pages= {
${pagesStr}
}`
}
function createStore() {
  const storePath = join(__dirname, '../../admin/store.js')
  const { importRoot, exportRoot } = createRoot()
  const { importLayout, exportLayout } = createLayout()
  const exportPages = createPages()
  const res = `
/* eslint-disable */
import { lazy } from 'react'
${importRoot}
${importLayout}

${exportPages}
${exportRoot}
${exportLayout}
  `
  fs.ensureFileSync(storePath)
  fs.writeFileSync(storePath, res)
}
if (!isBuildMode()) {
  if (watch) {
    chokidar
      .watch(__pages, {
        depth: 0,
        ignored: /\../,
        ignoreInitial: true
      })
      .on('all', () => {
        createStore()
      })
  }
  chokidar
    .watch(__src, {
      depth: 0,
      ignored: ['pages', '*.json', '*.md', '*.txt'],
      cwd: __src,
      ignoreInitial: true
    })
    .on(['all'], (e, p) => {
      if (
        ['add', 'addDir', 'unlink', 'unlinkDir'].includes(e) &&
        ['layout', 'index.js', 'index.jsx', 'index.tsx'].includes(p)
      ) {
        createStore()
      }
    })
}
module.exports = createStore
