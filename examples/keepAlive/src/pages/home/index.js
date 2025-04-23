import { Link } from '@zswl/admin'
import store from './store'
import { useEffect } from 'react'

function Index() {
  useEffect(() => {
    console.log('mount home')
  }, [])
  console.log('render /home')
  const { count, setCount } = store
  return (
    <div>
      Home page
      <br />
      <button onClick={setCount}>{count}</button>
      <Link to="/">index</Link>
      <br />
      <Link to="/home/1">home/1</Link>
      <br />
      <Link to="/home/2">home/2</Link>
      <br />
      <Link to="/home/detail/1">home/detail/1</Link>
      <br />
      <Link to="/list">list</Link>
      <div style={{ height: 1000 }}></div>
    </div>
  )
}

export default Index
