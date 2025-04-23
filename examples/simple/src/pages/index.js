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
  const src1 = '/public/task-bg.png'
  const src2 = 'task-bg'
  const ref = useRef()
  useEffect(() => {
    console.log(ref.current)
  }, [])
  return (
    <div>
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
      <img src={src1} alt="task-bg" />
      <img src={`/public/${src2}.png`} alt="task-bg" />
      <img src="/public/test.svg" alt="task-bg" />
      <img src="@/public/test.svg" alt="task-bg" />
      <Link to="/list">list</Link>
    </div>
  )
}

function Test({ ref }) {
  return <div ref={ref}>test</div>
}
export default Index
