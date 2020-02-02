module.exports = {
  //启用的端口号
  port: 3000,
  /*
  打包之后的引用资源的不同环境下的域名(注意最后的/一定要加),
  xxx是你在noble上的部署应用名，脚手架无法知道，所以需要你自己写
   */
  publicPath: './',
  proxy: {},
  // 可以设置哪些目录禁用cssModule
  cssModuleExcludes: null,
  /*
   打包出来的js和css是否加chunkhash
   true:   index.js->index.2314cdes.js
   false:   index.js->index.js?2314cdes
    */
  outputHash: true,
  onAfterBuild: null,
  //每次启动是否去检测版本号，默认开启
  checkVersion: true,
  externals: null,
  sourceMap: false,
  entry: null,
  alias: {},
  babel: null,
  webpack: null
}
