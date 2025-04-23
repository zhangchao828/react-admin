import { Link } from '@glcc/admin'
import { useEffect } from 'react'

function Index() {
  console.log('render list')
  useEffect(() => {
    console.log('useEffect list')
  }, [])
  return (
    <div className="test">
      list page
      <br />
      <Link to="/home">home</Link>
    </div>
  )
}
export default Index
