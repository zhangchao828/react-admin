module.exports = {
  port: 3000,
  // 是否使用文件式路由
  useFileRouter: {},
  eslint: true,
  sourceMap: false,
  publicPath: '/',
  // http代理
  proxy: {},
  // 设置别名
  alias: {},
  lessOptions: {},
  vite: false,
  https: false,
  webpack: {
    mf: false,
    externals: [],
    builtInExternals: {
      react: true,
      mobx: false,
      axios: false,
    },
    // 开发环境是否按需编译
    lazyCompilation: false,
  },
}
