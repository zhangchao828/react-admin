import { Renderer, observer, makeAutoObservable } from '@zswl/admin'
import { Button } from 'antd'
import { useEffect } from 'react'

// console.log(store)
const store = makeAutoObservable({
  // get size() {
  //   return store.count === 0 ? 'small' : 'large'
  // },
  size: 'small',
  setSize() {
    store.size = store.size === 'small' ? 'large' : 'small'
  },
  count: 0,
  setCount() {
    store.count++
  },
  element: 'button',
  setElement() {
    store.element = store.element === 'span' ? 'button' : 'span'
  },
  list: [],
  getList() {
    store.list = [1, 2, 4]
  },
})
function Home() {
  useEffect(() => {
    store.getList()
  }, [])
  return (
    <Renderer
      config={{
        $element: 'div',
        children: [
          {
            $element: 'button',
            size: '{size}',
            children: '{size}',
            onClick: '{setSize}',
          },
          {
            $element: 'button',
            children: '{count}',
            onClick: '{setCount}',
          },
          {
            $element: '{element}',
            children: '{count}',
            onClick: '{setElement}',
          },
          {
            $element: 'button',
            onClick: '{setCount}',
            $render() {
              return {
                type: 'primary',
                children: '{count}',
              }
            },
          },
        ],
      }}
      store={store}
      components={{
        button: Button,
        div: 'div',
      }}
    />
  )
}
export default observer(Home)
