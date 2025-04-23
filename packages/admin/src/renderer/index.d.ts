import { CSSProperties, FC, ReactNode } from 'react'

type StringElement =
  /** React的Fragment片段*/
  | 'fragment'
  | 'button'
  | 'table'
  | 'card'
  | 'cascader'
  | 'form'
  | 'form/group'
  | 'form/item'
  | 'form/config'
  | 'row'
  | 'col'
  | 'input'
  | 'page'
  | 'select'
  | 'textArea'
  | 'tag'
  | 'tabs'
  | 'switch'
  | 'treeSelect'
  | 'modal'
  | 'inputNumber'
  | 'progress'
  | 'dropdown'
  | 'dropdown/button'
  | 'datePicker'
  | 'datePicker/rangePicker'
  | 'drawer'
  | 'checkbox/group'
  | 'checkbox'
  | 'autoComplete'
  | 'anchor'
  | 'anchorLayout'
  | 'anchorLayout/item'
  | 'alert'
  | 'image'
  | 'image/group'
  | 'space'
  | 'transfer'
  | 'descriptions'
  | 'radioGroup'
  | 'searchbar'
  | 'searchbar/item'
  | 'segmented'
  | 'fileList'
  | 'upload'
  | 'upload/dragger'
  | 'timePicker'
  | 'timePicker/rangePicker'
  | 'descriptions/editableCell'
  | 'table/editableCell'
  | 'collapse'
  | 'collapse/panel'
  | 'checkboxGroup'
  | 'action'
  | 'action/item'
  | 'block'
  | 'editor'
/**
 * 一个配置中包含$element或者$render属性的就表示一个渲染节点
 */
type Config =
  | {
      /**
       * 节点元素
       */
      $element?: StringElement | ReactNode | Config
      /**
       * 表示该节点能接受的属性参数
       */
      $args?: string[]
      /**
       * 表示向该节点注入的数据，该节点和其子代节点都能直接访问到该数据
       * 数据也可以从store获取再注入
       */
      $data?: object
      /**
       * 表示该节点循环渲染
       */
      $for?:
        | string
        | any[]
        | {
            value: string | any[]
            /** 表示子项的字段名，默认是item */
            item: string
          }
      /**
       * 表示该节点需要条件判断
       */
      $if?: any
      /**
       * @param node 节点元素
       * @param store 传进来的store，
       * 自定义渲染
       * 当返回的是一个对象时，会将该对象和当前节点的props合并，作为节点的最终props
       * 当该方法内使用到store里面的属性时，该函数就会变成响应式，对应的数据变化时，该函数就会自动执行，
       * 此时就可以根据不同数据渲染不同内容，基本上这里就可以实现业务逻辑的修改
       */
      $render?(store: any, node: any): any
      key?: string | number
      style?: CSSProperties
      className?: string
      children?: Config | Config[]
      [other: string]: any
    }
  | ReactNode

type PluginType = (config: Config) => Config | void
interface RendererProps {
  config?: Config | Config[]
  store?: any
  /**
   * 额外的组件映射，比如{myInput:Input}，那么配置中$element就可以配置'myInput'
   */
  components?: object
  /**
   * plugins 扩展配置的插件，返回的配置信息会和原有的配置合并，每一个节点元素（包含$render或者$element的）都会依次调用插件方法
   * 比如你可以在原有的配置信息中加额外字段className:'xxx',原本这个配置不起任何作用的
   * 然后在插件中判断节点中存在className，那么就返回props:{className:'xxx'},
   * 这样就将原来的节点属性props中塞进去了className属性，这样就起作用了
   * 插件方法必须返回Config，前一个插件返回的配置会当作下一个插件方法的参数，
   */
  plugins?: PluginType[]
  /**
   * 远程组件库名称
   */
  remoteName?: string
}
declare const Renderer: FC<RendererProps> & {
  inject(options: { components?: object; plugins?: PluginType[] })
  useStore(): object
}
export default Renderer
