import { observer } from 'mobx-react-lite'
import { isObservable } from 'mobx'
import { Remote } from '../federation'
import {
  isValidElement,
  cloneElement,
  createElement,
  memo,
  createContext,
  useContext,
  Fragment,
  useCallback,
  useMemo,
} from 'react'
import { isPlainObject } from 'lodash-es'

const RendererContext = createContext({})
function loopProps(props, store, options, key, params) {
  if (Array.isArray(props)) {
    return props.map((item, index) => loopProps(item, store, options, index, params))
  }
  if (isValidElement(props)) {
    return props
  }
  if (typeof props === 'string') {
    return getDynamicProps(store, params, props)
  }
  if (isPlainObject(props) && !isObservable(props)) {
    return Object.keys(props).reduce((previousValue, currentValue) => {
      const value = loopProps(
        compile(props[currentValue], store, options, key, params),
        store,
        options,
        key
      )
      if (currentValue[0] === '$' && currentValue[1] && typeof value === 'function') {
        return {
          ...previousValue,
          [currentValue.substring(1)]: value(store, params),
        }
      }
      return {
        ...previousValue,
        [currentValue]: value,
      }
    }, {})
  }
  return props
}

function getDynamicProps(store, params = {}, name) {
  const str = name.trim()
  if (str[0] === '{' && str[str.length - 1] === '}') {
    const content = str.substring(1, str.length - 1)
    return new Function(...Object.keys(params), 'store', '$', `return ${content}`)(
      ...Object.values(params),
      store,
      params
    )
  }
  return name
}
function isValidNode(node) {
  return isPlainObject(node) && (node.$element || node.$render)
}
const Wrapper = observer(({ $store, $element, $render, $options, $params, ...restProps }) => {
  let { $for, $if, $args, $data, children, ...realProps } = restProps
  const hasDynamicChild = Object.hasOwnProperty.call(restProps, '$children')
  const hasArgs = Object.hasOwnProperty.call(restProps, '$args')
  const hasIf = Object.hasOwnProperty.call(restProps, '$if')
  const hasFor = Object.hasOwnProperty.call(restProps, '$for')
  const hasData = Object.hasOwnProperty.call(restProps, '$data')
  if (hasData) {
    // 注入data，其自身和子代都能访问到这个data数据
    $data = loopProps($data, $store, $options, null, $params)
    $params = { ...$params, ...$data }
  }
  if (hasDynamicChild) {
    const dynamicChild = realProps['$children']
    if (typeof dynamicChild === 'function') {
      delete realProps['$children']
      children = dynamicChild($store, $params)
    }
  }
  if (hasIf) {
    // 处理条件判断
    $if = loopProps($if, $store, $options, null, $params)
    if (!$if) {
      return null
    }
  }
  if (hasFor) {
    // 处理循环,item是子项的字段名，默认就是item
    let list = $for
    let itemName = 'item'
    if (isPlainObject($for)) {
      list = $for.value || []
      itemName = $for.item || itemName
    }
    list = loopProps(list, $store, $options, null, $params)
    const arr = []
    let index = 0
    for (let item of list) {
      arr.push(
        compile({ $element, children, $render, ...realProps }, $store, $options, index, {
          ...$params,
          [itemName]: item,
        })
      )
      index++
    }
    return arr
  }
  const allProps = loopProps(realProps, $store, $options, null, $params)
  let node = null
  if (hasArgs) {
    const params = ($args || []).reduce((previousValue, currentValue) => {
      return {
        ...previousValue,
        [currentValue]: allProps[currentValue],
      }
    }, {})
    $params = { ...$params, ...params }
  }
  if (typeof $element === 'string') {
    $element = getDynamicProps($store, $params, $element)
  }
  if ($element) {
    if (typeof $element === 'string') {
      if ($element === 'fragment') {
        node = <Fragment>{compile(children, $store, $options, null, $params)}</Fragment>
      } else if ($options.components[$element]) {
        node = createElement(
          $options.components[$element],
          allProps,
          compile(children, $store, $options, null, $params)
        )
      } else {
        // 远程组件
        node = (
          <Remote {...allProps} name={$options.remoteName} pathname={`/${$element}`}>
            {compile(children, $store, $options, null, $params)}
          </Remote>
        )
      }
    } else if (isValidElement($element)) {
      node = cloneElement($element, allProps, compile(children, $store, $options, null, $params))
    } else if (isValidNode($element)) {
      node = compile($element, $store, $options, null, $params)
    } else {
      node = createElement($element, allProps, compile(children, $store, $options, null, $params))
    }
  }
  if ($render) {
    const res = $render($store, node)
    if (isValidElement(res)) {
      return res
    }
    // if (isPlainObject(res) && !isValidNode(res)) {
    //   return cloneElement(node, loopProps(res, $store, $options, null, $params))
    // }
    if (isPlainObject(res) && !isValidNode(res)) {
      // 这里的res对象不去解析了，因为这里一般都是确定好的数据
      return cloneElement(node, res)
    }
    return compile(res, $store, $options, null, $params) ?? null
  }
  return node
})
function compile(config, store, options, key, params = {}) {
  if (Array.isArray(config)) {
    return config.map((item, index) => compile(item, store, options, index, params))
  }
  if (isValidElement(config)) {
    return config
  }
  if (isPlainObject(config)) {
    config = options.plugins(config) || {}
    let { $render, $element, ...props } = config
    if ($element || $render) {
      return (
        <Wrapper
          key={config.key || key}
          {...props}
          $element={$element}
          $store={store}
          $render={$render}
          $options={options}
          $params={params}
        />
      )
    }
    return config
  }
  if (typeof config === 'string') {
    return getDynamicProps(store, params, config)
  }
  return config
}

let contextOptions = {
  plugins: [],
  components: {},
}

const Renderer = memo(({ config = null, store, children, components, plugins, remoteName }) => {
  const ctx = useContext(RendererContext) || {}
  store = store || ctx.store
  plugins = plugins || ctx.plugins
  components = components || ctx.components
  remoteName = remoteName || ctx.remoteName || 'shared'
  const pluginList = [...contextOptions.plugins, ...(plugins || [])]
  components = {
    ...contextOptions.components,
    ...components,
  }
  const pluginFunc = useCallback(
    (p) => {
      let obj = p
      pluginList.forEach((item) => {
        obj = {
          ...obj,
          ...item(obj, components),
        }
      })
      return obj
    },
    [pluginList]
  )
  const ctxValues = useMemo(() => {
    return {
      store,
      components,
      plugins,
      remoteName,
    }
  }, [store, components, plugins, remoteName])
  const res = compile(config, store || {}, {
    components,
    plugins: pluginFunc,
    // 远程组件库名称
    remoteName,
  })
  return (
    <RendererContext.Provider value={ctxValues}>
      {res}
      {children}
    </RendererContext.Provider>
  )
})

function useStore() {
  return useContext(RendererContext).store
}
Renderer.inject = (options) => {
  contextOptions = {
    plugins: [],
    components: {},
    ...options,
  }
}
Renderer.useStore = useStore
export default Renderer
