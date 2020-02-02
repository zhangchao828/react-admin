const createIndexHtml = require('./createIndexHtml')
const createStore = require('./createStore')
module.exports = function() {
  createIndexHtml()
  createStore()
}
