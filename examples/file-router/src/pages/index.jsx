import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function Index() {
  useEffect(() => {
    console.log('index')
  }, [])
  return (
    <div>
      Index page
      <br />
      <Link to="/home">home</Link>
      <br />
      <Link to="/home/1">home/id</Link>
    </div>
  )
}