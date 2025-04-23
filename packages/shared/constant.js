module.exports = {
  // 私有库的前缀名
  PRIVATE_NAME: '@zswl/',
  PROJECT_CONFIG: 'admin.config.js',
  LOCAL_CONFIG: 'local.config.js',
  NPM_REGISTRY: 'http://nexus.zswltec.com:8888/repository/npm-group',
  // admin工程发布的npm包名称
  ADMIN_NPM: '@zswl/admin',
  // 组件库npm包名称
  COMPONENT_NPM: '@zswl/components',
  // 远程组件库npm包名称
  REMOTE_NPM: '@zswl/remote',
  // admin包安装后可在package.json中执行的命令的名字
  ADMIN_SCRIPT: 'admin',
  CLI_NPM: '@zswl/cli',
  CLI_SCRIPT: 'zswl',
  TEMPLATE: 'http://gitlab.zswltec.com/zswl/admin-template.git',
  // 一些名称常量
  RUN_TIME: 'RUNTIME', // 运行时js脚本名称
  APP: 'app', // 入口js名称
  REACT_REFRESH: 'reactRefreshSetup', // 热更新的js名称
}
