import { Link } from '@glcc/admin'
import { useEffect } from 'react'

function Index() {
  console.log('render index')
  useEffect(() => {
    console.log('mount index')
    return () => {
      console.log('unmount index')
    }
    // history.replace('/home')
  }, [])
  return (
    <div className="test">
      Index page
      <br />
      <Link to="/home">home</Link>
      <br />
      <Link to="/home/1">home/id</Link>
      <br />
      <Link to="/list">list</Link>
      <br />
      <Link to="/home/age">home/age</Link>
    </div>
  )
}

export default Index
