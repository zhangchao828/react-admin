type External =
  | string
  | {
      global?: any
      script?: string
      /**
       * 是否异步加载script
       */
      async?: boolean
    }

interface Externals {
  react?: External
  'react-dom'?: External
  'react-router-dom'?: External
  axios?: External
  mobx?: External
  'mobx-react-lite'?: External
  'moment/locale/zh-cn'?: External
  antd?: External
  moment?: External

  [name: string | SomeModulesName]: External
}
type Federation = Array<{
  /**
   * 模块联邦的名称
   */
  name: string
  /**
   * 模块联邦应用的地址
   */
  publicPath: string
}>
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
type MicroApp = {
  name: string
  entry: string
  activeRule: string
  credentials?: boolean
}
type Px2viewport = {
  viewportWidth?: number
  unitPrecision?: number
  propList?: string[]
  selectorBlackList?: string[]
  exclude?: (string | RegExp)[] | RegExp
  include?: (string | RegExp)[] | RegExp
  [name: string]: any
}
type ProjectConfig = {
  port?: number
  /**
   * 是否启用eslint检测
   */
  eslint?: boolean
  /**
   * publicPath路径
   */
  publicPath?: string
  https?: boolean
  /**
   * http代理
   */
  proxy?: object
  lessOptions?: LessOptions
  css?: string[]
  externals?: Externals
  /**
   * 模块联邦
   */
  federation?: false | string | Federation
  /**
   * 开发环境是否按需编译,
   */
  lazyCompilation?: boolean
  /**
   * qiankun微应用
   */
  microApp?: string | Array<MicroApp>
  px2viewport?: boolean | Px2viewport
}
type ConfigFuncParams = {
  env: 'dev' | 'pre' | 'pro' | string
  command: 'start' | 'build'
}
type ConfigFunc = (params: ConfigFuncParams) => ProjectConfig
export default function defineConfig(config: ProjectConfig | ConfigFunc): ProjectConfig
