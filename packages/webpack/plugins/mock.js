const { getResponse } = require('@zc/dev-utils/mock')

module.exports = {
  name: 'mock',
  middleware(req, res, next) {
    const { mock_url } = req.headers
    if (mock_url) {
      const { delay, status, data } = getResponse(req)
      if (delay) {
        setTimeout(() => {
          res.status(status).send(data)
        }, delay)
      } else {
        res.status(status).send(data)
      }
    } else {
      next()
    }
  },
}
