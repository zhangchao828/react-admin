import { useAppMeta } from '../appContext'

/*
权限组件，
value：表示所要展示的组件的权限标识，当时函数时表示自定义权限，返回true或者false
children：就是被包裹的需要权限控制的组件，
该组件会在权限池里去寻找对应value的权限值是true还是false，
由此来判断组件是否有权限，
其中权限池应该通过某个接口获取，是一个对象映射表或者数组，获取之后
通过AppContext中得setMeta去设置，
比如我们拿到权限池对象映射表如下
['a','b']
或
{
  'a': true,
  'b': true
}
使用如下
<Access value="a">
  <Button>按钮a</Button>
</Access>
 */
function isValidValue(value) {
  return typeof value === 'string' || typeof value === 'number' || Array.isArray(value)
}
function validate(value, access) {
  if (!isValidValue(value)) {
    return false
  }
  if (access === '*') {
    return true
  }
  if (!access) {
    return false
  }
  if (Array.isArray(value)) {
    return value.some((item) => validate(item))
  }
  return Array.isArray(access) ? access.includes(value) : !!access[value]
}
export function Access({ value, children, fallback }) {
  const { access } = useAppMeta()
  if (validate(value, access)) {
    return children
  }
  return fallback === undefined ? null : fallback
}
export function useAccess(value) {
  const { access } = useAppMeta()
  return validate(value, access)
}
