import { history, useAppContext, Remote, makeAutoObservable, http } from '@zswl/admin'
import { useEffect, useRef, useState } from 'react'

class Store {
  constructor() {
    makeAutoObservable(this)
  }
  count = 0
  setCount = () => {
    this.count++
  }
}
const store = new Store()
function Index() {
  const { data, ...rest } = useAppContext()
  const [num, setNum] = useState(0)
  useEffect(() => {
    // console.log('host', data, rest)
  }, [data])
  return (
    <div>
      host index page
      <div
        onClick={() => {
          history.push('/remote')
        }}
      >
        remote
      </div>
      <div
        onClick={() => {
          history.push('/remoteTest')
        }}
      >
        remote2
      </div>
      <button
        onClick={() => {
          http.get('/api/test')
        }}
      >
        http
      </button>
      <button onClick={store.setCount}>++</button>
      <button onClick={() => setNum(num + 1)}>num{num}</button>
      <Remote.Component name="remote" is="Test" title={'aaaa'} />
      {/*<Test></Test>*/}
      <Remote store={store} name={'remote'} pathname={'/base/button?name=aaa'} />
    </div>
  )
}
export default Index
