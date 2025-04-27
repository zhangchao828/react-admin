import { Configuration } from 'webpack'
import { ProxyConfigArray } from 'webpack-dev-server'

type External =
  | false
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
  [name: string]: External
}
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
type Federation = {
  /**
   * shared是共享的远程组件库
   */
  name: string | 'shared'
  /**
   * 是否包裹入口（src/index.js）和layout （src/layout/index.js）
   */
  layout?: boolean
  entry?: string
  list?: Array<Omit<Federation, 'list'>>
}
type ProjectConfig = {
  /**
   * 医生检测项目更新，配置，依赖等检测
   */
  doctor?: boolean
  /**
   * 文件路由的前缀
   * 比如：配置成'/xxx',那么生成的路由都会带上/xxx前缀
   */
  base?: string | false
  port?: number
  /**
   * publicPath路径
   */
  publicPath?: string
  https?: boolean
  /**
   * http代理
   */
  proxy?: ProxyConfigArray
  lessOptions?: LessOptions
  externals?: false | Externals
  /**
   * 开发环境是否按需编译,
   */
  lazyCompilation?: boolean
  /**
   * 模块联邦
   */
  federation?: false | string | Array<Federation> | Omit<Federation, 'layout'>
  /**
   * api
   */
  yapi2ts?: {
    serverUrl?: string
    token?: string
    [other: string]: any
  }
  px2vw?:
    | boolean
    | {
        viewportWidth?: number // 设计稿的视窗宽度
        [other: string]: any
      }
  webpack?: Configuration
  /**
   * 是否懒加载文件路由
   */
  lazyImport?: boolean
}
type ConfigFuncParams = {
  env: 'dev' | 'test' | 'pre' | 'prod' | string
  command: 'start' | 'build'
}
type ConfigFunc = (params: ConfigFuncParams) => ProjectConfig
export default function defineConfig(config: ProjectConfig | ConfigFunc): ProjectConfig

export type Config = ConfigFunc | ProjectConfig
