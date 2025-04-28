import { http, Host, Link } from '@glcc/admin'
import styles from './style.less'
import { Button } from 'antd'
import { useEffect, useRef } from 'react'

http.setConfig({
  baseURL() {
    return '/api'
  },
  mock: {
    yapiUrl: '/aaaaa',
  },
  headers() {
    return {
      name: 'aaa',
    }
  },
})
function Index() {
  const src1 = '/public/test-bg.png'
  const src2 = 'test-bg'
  const ref = useRef()
  useEffect(() => {
    console.log(ref.current)
  }, [])
  const add = () => {
    console.log('host1')
  }
  // function add(){
  //   console.log('add')
  // }
  return (
    <div onClick={add}>
      <Host pathname="/abc/list" />
      <Button
        className={styles.test}
        onClick={() => {
          http
            .get('/public/data.json', {
              original: true,
            })
            .then((res) => {
              console.log(res)
            })
        }}
      >
        http
      </Button>
      <Test ref={ref} />
      <div className={styles.bg}></div>
      <img src={src1} alt="test-bg" />
      <img src={`/public/${src2}.png`} alt="test-bg" />
      <img src="/public/test.svg" alt="test-bg" />
      <img src="@/public/test.svg" alt="test-bg" />
      <Link to="/list">list</Link>
    </div>
  )
}

function Test({ ref }) {
  return <div ref={ref}>test</div>
}
export default Index
