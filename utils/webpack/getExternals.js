const { externals } = require('../hlj/getHljConfig')()
const getExternals = require('../tools/getExternals')
module.exports = function() {
  return getExternals(
    {
      react: {
        name: 'React',
        cdn: '//unpkg.com/react@16.13.0/umd/react.production.min.js'
      },
      'react-dom': {
        name: 'ReactDOM',
        cdn: '//unpkg.com/react-dom@16.13.0/umd/react-dom.production.min.js'
      },
      'react-router-dom': {
        name: 'ReactRouterDOM',
        cdn: '//unpkg.com/react-router-dom@5.1.2/umd/react-router-dom.min.js'
      }
      // axios: {
      //   name: 'axios',
      //   cdn: '//unpkg.com/axios@0.18.1/dist/axios.min.js'
      // }
    },
    externals
  )
}
