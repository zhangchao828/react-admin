import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function Index() {
  useEffect(() => {
    console.log('micro-index')
  }, [])
  return (
    <div>
      micro index page
      <br />
      <Link to="/list">list</Link>
      <br />
      <Link to="/home">home</Link>
    </div>
  )
}
