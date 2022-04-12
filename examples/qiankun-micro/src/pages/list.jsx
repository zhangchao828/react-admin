import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function Index() {
  useEffect(() => {
    console.log('micro-list')
  }, [])
  return (
    <div>
      micro list page
      <br />
      <Link to="/home">home</Link>
      <br />
      <Link to="/">index</Link>
    </div>
  )
}
