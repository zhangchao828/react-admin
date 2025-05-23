const { __mock, __mockUrls } = require('./paths')
const message = require('./message')
const fs = require('fs-extra')
const glob = require('glob')
const { join } = require('path')
const Mock = require('mockjs')
const watchFiles = require('./watchFiles')

let mockOptions = null
let hasMockError = false
function watchMock() {
  watchFiles(
    ['**/*.js'],
    {
      event: 'all',
      cwd: __mock,
    },
    (m, p) => {
      combineMock(m, join(__mock, p))
    }
  )
}
function combineMock(m, p) {
  if (fs.pathExistsSync(__mock)) {
    try {
      mockOptions = {}
      const allMockPath = glob.sync(join(__mock, '**/*.js'))
      allMockPath.forEach((path) => {
        if (m === 'change' && p === join(path)) {
          // 修改mock文件时，只删除当前被修改文件的缓存
          delete require.cache[require.resolve(path)]
        }
        const config = require(path)
        mockOptions = {
          ...mockOptions,
          ...config,
        }
        fs.outputFileSync(
          __mockUrls,
          `
          const mockUrls= ${JSON.stringify(Object.keys(mockOptions))}
          export default function hasLocalMock(config){
            const { method, url, name } = config
            const realUrl = name || url
            const lowerMethod = method.toLowerCase()
            const upperMethod = method.toUpperCase()
            const urlWithMethod = upperMethod+':'+realUrl
            const urlWithLowerMethod = lowerMethod+':'+realUrl
            const match = mockUrls.includes(urlWithMethod) || mockUrls.includes(urlWithLowerMethod)
            return lowerMethod === 'get' ? mockUrls.includes(realUrl) || match : match
        }`.trim()
        )
      })
      if (hasMockError) {
        message.clearLog()
        hasMockError = false
      }
      message.success('mock compiled successfully\n')
    } catch (e) {
      hasMockError = true
      message.warning('------------------------------Mock数据错误------------------------------')
      console.log(e)
      message.warning('------------------------------Mock数据错误------------------------------')
    }
  }
}
function getResponse(req) {
  const { method, headers } = req
  const lowerMethod = method.toLowerCase()
  const { mock_url, mock_delay, mock_status, mock_name } = headers
  const delay = parseInt(mock_delay)
  const status = parseInt(mock_status) || 200
  const realUrl = mock_name || mock_url
  const urlWithMethod = `${method}:${realUrl}`
  const urlWithLowerMethod = `${lowerMethod}:${realUrl}`
  const match = mockOptions[urlWithMethod] || mockOptions[urlWithLowerMethod]
  let value = method === 'GET' ? mockOptions[realUrl] || match : match
  if (value === undefined) {
    return {
      status: 404,
    }
  }
  if (typeof value === 'function') {
    const res = Mock.mock(value(req))
    return res || { status: 404 }
  }
  value = {
    code: 200,
    msg: 'success',
    success: true,
    data: value,
  }
  const mockData = Mock.mock(value)
  return {
    status,
    delay,
    data: mockData,
  }
}
module.exports = {
  init() {
    combineMock()
    watchMock()
  },
  getResponse,
}
