import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function Index() {
  useEffect(() => {
    console.log('home/id')
  }, [])
  return (
    <div>
      Home/id page
      <input type="text" />
      <br />
      <Link to="/">index</Link>
      <br />
      <Link to="/home">home</Link>
    </div>
  )
}
Index.title = 'Home Detail'
