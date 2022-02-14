const postcssEnv = require('postcss-preset-env')

module.exports = {
  plugins: [
    postcssEnv({
      autoprefixer: {
        flexbox: 'no-2009',
        remove: false,
      },
      stage: 3,
    }),
  ],
}
