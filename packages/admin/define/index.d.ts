interface Script {
  development?: string
  production?: string
  async?: boolean
}
interface Externals {
  name?: string
  global?: any
  script?: string | Script
  devOnly?: boolean
}
interface BuiltInExternals {
  mobx?: boolean
  axios?: boolean
  reactRouter?: boolean
}
interface FileRouter {
  /**
   *忽略的文件名，不会被当做路由
   */
  ignore?: Array<string>
}
interface MF {
  /**
   * 当前应用是否注册为一个微服务应用
   */
  name?: string
  /**
   * 当前项目需要使用哪些微服务系统，这些微服务必须是经过注册过的
   * 使用了该配置后，需要注意当前项目的package.json中的name最好不要出现数字，中文，- 等特殊字符，有共享模块时，可能会报错
   */
  remotes?: Array<{
    /**
     * 微服务的名称
     */
    name: string
    /**
     * 微服务的地址
     */
    publicPath: string
  }>
  /**
   * 共享模块
   */
  shared?: any
}
interface WebpackOptions {
  /**
   * 模块联邦
   */
  mf?: false | MF
  /**
   * 开发环境是否按需编译,
   */
  lazyCompilation?: boolean
  /**
   * webpack的externals配置
   */
  externals?: Array<string | Externals>
  builtInExternals?: false | null | BuiltInExternals
}
type ViteOptions = boolean | {}
type LessOptions = {
  /**
   * 定义less变量
   */
  globalVars?: object
  /**
   * 修改less变量
   */
  modifyVars?: object
}
type ProjectConfig = {
  port?: number
  /**
   * 是否使用文件系统路由
   */
  useFileRouter?: boolean | FileRouter
  /**
   * 是否启用eslint检测
   */
  eslint?: boolean
  /**
   * 是否生成sourceMap文件
   */
  sourceMap?: boolean
  /**
   * publicPath路径
   */
  publicPath?: string
  https?: boolean
  /**
   * http代理
   */
  proxy?: object
  /**
   * 设置别名
   */
  alias?: object
  lessOptions?: LessOptions
  webpack?: WebpackOptions
  vite?: ViteOptions
}
type ConfigFuncParams = {
  env: 'dev' | 'pre' | 'pro' | string
  command: 'start' | 'build'
}
type ConfigFunc = (params: ConfigFuncParams) => ProjectConfig
export default function defineConfig(config: ProjectConfig | ConfigFunc): ProjectConfig
