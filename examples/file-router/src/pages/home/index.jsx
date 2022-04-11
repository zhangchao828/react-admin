import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function Index() {
  useEffect(() => {
    console.log('home')
  }, [])
  return (
    <div>
      Home page
      <br />
      <Link to="/">index</Link>
      <br />
      <Link to="/home/1">home/id</Link>
    </div>
  )
}
