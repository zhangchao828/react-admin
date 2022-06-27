const postcssEnv = require('postcss-preset-env')
const px2viewportPlugin = require('postcss-px-to-viewport')
const { getConfig } = require('zs-shared/project')

const { px2viewport } = getConfig()
module.exports = {
  plugins: [
    postcssEnv({
      autoprefixer: {
        flexbox: 'no-2009',
        remove: false,
      },
      stage: 3,
    }),
    px2viewport &&
      px2viewportPlugin({
        viewportWidth: 375,
        ...px2viewport,
      }),
  ].filter(Boolean),
}
