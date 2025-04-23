const createIndexHtml = require('./indexHtml')
const createSrcIndex = require('./srcIndex')
const createIndexPage = require('./indexPage')
const createLayout = require('./layout')
const createConfig = require('./config')

module.exports = function () {
  createIndexHtml()
  createSrcIndex()
  createLayout()
  createIndexPage()
  createConfig()
}
