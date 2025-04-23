import { FC, ReactNode } from 'react'

/**
 权限组件，
 value：表示所要展示的组件的权限标识，当时函数时表示自定义权限，返回true或者false
 children：就是被包裹的需要权限控制的组件，
 该组件会在权限池里去寻找对应value的权限值是true还是false，
 由此来判断组件是否有权限，
 其中权限池是通过App组件的init获取的access属性设置的
 比如我们拿到权限池对象映射表如下
 ['a','b']
 或
 {
  'a': true,
  'b': false
}
 使用如下
 <Access value="a">
 <Button>按钮a</Button>
 </Access>
 */
export type AccessValue = (string | number)[] | string | number
interface AccessProps {
  /**
   * 权限标识，一般是一个字符串,
   * 也可以是一个数组，此时表示数组中只要有一个标识有权限就表示最终有权限
   */
  value?: AccessValue
  /**
   * 没有权限的时候显示，默认为undefined
   */
  fallback?: ReactNode
}
declare const Access: FC<AccessProps> & {
  /**
   * 判断某个标识是否存在于权限池中，一般在非组件或某个方法中使用
   * @param value 权限标识
   */
  validate(value: AccessValue): boolean
}
export default Access

export declare function useAccess(value: AccessValue): boolean
