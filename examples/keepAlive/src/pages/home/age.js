import { Link, observer } from '@zswl/admin'
import { useEffect } from 'react'

function Index() {
  console.log('render home/age')
  useEffect(() => {
    console.log('mount home/age')
  }, [])
  return (
    <div>
      <div>age</div>
      <br />
      <Link to="/home">home</Link>
      <br />
      <Link to="/list">list</Link>
      <br />
      <Link to="/">index</Link>
    </div>
  )
}

export default observer(Index)
