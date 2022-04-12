import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function Index() {
  useEffect(() => {
    console.log('micro-home')
  }, [])
  return (
    <div>
      micro home page
      <br />
      <Link to="/list">list</Link>
      <br />
      <Link to="/">index</Link>
    </div>
  )
}
