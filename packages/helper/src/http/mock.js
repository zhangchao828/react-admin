import hasLocalMock from '~admin/has-local-mock'

export default function setMock(config, { mock, mockUrl }) {
  if (hasLocalMock({ method: config.method, url: mockUrl, name: mock?.name })) {
    config.url = '/admin-mock:' + config.url
    if (!config.headers) {
      config.headers = {}
    }
    config.headers.mock_url = mockUrl
    if (typeof mock === 'string') {
      config.headers['mock_name'] = mock
    }
    if (typeof mock === 'object') {
      Object.keys(mock || {}).forEach((key) => {
        config.headers[`mock_${key}`] = mock[key]
      })
    }
  } else if (mock.yapiUrl) {
    config.url = mock.yapiUrl + mockUrl
  }
}
