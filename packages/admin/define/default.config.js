module.exports = {
  port: 3000,
  eslint: true,
  publicPath: '/',
  // http代理
  proxy: {},
  lessOptions: {},
  vite: false,
  https: false,
  webpack: {
    mf: false,
    externals: [],
    builtInExternals: {
      react: true,
      reactRouter: true,
      mobx: false,
      axios: false,
    },
    // 开发环境是否按需编译
    lazyCompilation: false,
  },
}
