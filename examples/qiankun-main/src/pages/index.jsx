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
      <Link to="/demo">demo</Link>
      <p>Remote</p>
    </div>
  )
}
