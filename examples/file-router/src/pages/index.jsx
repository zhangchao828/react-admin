import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { observer } from '@zc/admin'
import store from './store'

function Index() {
  const { count } = store
  useEffect(() => {
    console.log('index')
  }, [])
  console.log(count)
  return (
    <div>
      Index page
      <button onClick={store.changeCount}>count:{count}</button>
      <button onClick={() => store.getList()}>getList</button>
      <br />
      <Link to="/home">home</Link>
      <br />
      <Link to="/home/1">home/id</Link>
    </div>
  )
}
Index.title = 'Index'

export default observer(Index)
