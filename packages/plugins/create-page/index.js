const { join } = require('path')
const fs = require('fs-extra')
const { __pages } = require('@zswl/shared/paths')

function success(res, data) {
  res.status(200).send({
    code: 200,
    msg: 'success',
    success: true,
    ...data,
  })
}
function error(res, data) {
  res.status(500).send({
    code: 500,
    success: false,
    msg: 'error',
    ...data,
  })
}
function createPage(res, body) {
  let { path, store, page, style, override = false } = body
  if (!path) {
    return error(res, { msg: '路由地址必填' })
  }
  path = '/' + path.trim().split('/').filter(Boolean).join('/')
  const type = ['.js', '.jsx', '.tsx'].find((item) => path.includes(item))
  if (!type) {
    if (path.endsWith(']')) {
      path += '.js'
    } else {
      path += '/index.js'
    }
  }
  const dir = path.substring(0, path.lastIndexOf('/'))
  const pagePath = join(__pages, path)
  if (!override && fs.pathExistsSync(pagePath)) {
    return success(res, {
      code: 1,
      msg: '该路径已存在',
      path,
    })
  }
  // 校验通过，开始创建页面
  try {
    if (store) {
      fs.outputFileSync(join(__pages, dir, 'store.js'), store)
    }
    if (page) {
      fs.outputFileSync(pagePath, page)
    }
    if (style) {
      const stylePath = join(__pages, dir, 'style.less')
      if (!fs.pathExistsSync(stylePath)) {
        fs.outputFileSync(stylePath, style)
      }
    }
    const apiPath = join(__pages, dir, 'api.js')
    if (!fs.pathExistsSync(apiPath)) {
      fs.outputFileSync(
        apiPath,
        `
    import { http } from '@zswl/admin'

export default {
  list: (params) => http.get('/api/list', { params }),
  create: (data) => http.post('/api/create', data),
}
    `.trim()
      )
    }
    success(res, { code: 200, path })
  } catch (e) {
    error(res, {
      path,
      msg: e,
    })
  }
}
module.exports = {
  name: 'create-page',
  middleware(req, res, next) {
    const { originalUrl, body } = req
    const [name, reqType] = originalUrl.split('/').filter(Boolean)
    if (name === 'zswl-admin' && reqType === 'create-page') {
      return createPage(res, body)
    } else {
      next()
    }
  },
}
