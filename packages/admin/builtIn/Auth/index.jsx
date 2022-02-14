import { useAppContext, getAppContext } from '../AppContext'

/*
权限组件，
value：表示所要展示的组件的权限标识，当时函数时表示自定义权限，返回true或者false
children：就是被包裹的需要权限控制的组件，
该组件会在权限池里去寻找对应value的权限值是true还是false，
由此来判断组件是否有权限，
其中权限池应该通过某个接口获取，是一个对象映射表或者数组，获取之后
通过this.props.setAppInfo({})去设置，
比如我们拿到权限池对象映射表如下
['a','b']
或
{
  'a': true,
  'b': true
}
使用如下
<Auth value="a">
  <Button>按钮a</Button>
</Auth>
 */
function isValidValue(value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'function' ||
    Array.isArray(value)
  )
}

export function Auth({ value, children, fallback }) {
  const { data } = useAppContext()
  if (auth(value)) {
    return children
  }
  const res = fallback === undefined ? data.fallback : fallback
  return res === undefined ? null : res
}
export function auth(value) {
  const { authorities } = getAppContext().data
  if (!isValidValue(value)) {
    return false
  }
  if (authorities === '*') {
    return true
  }
  if (typeof value === 'function') {
    return !!value({ authorities })
  }
  if (!authorities) {
    return null
  }
  if (Array.isArray(value)) {
    return value.some((item) => auth(item))
  }
  return Array.isArray(authorities) ? authorities.includes(value) : !!authorities[value]
}
