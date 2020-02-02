const plugins = [
  require('postcss-import'),
  require('postcss-url'),
  require('autoprefixer')({
    remove: false
  })
]
module.exports = {
  plugins
}
