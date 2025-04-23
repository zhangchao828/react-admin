import { Link, getRandomInt } from '@glcc/admin'
import { useEffect } from 'react'

function Index({ params }) {
  console.log('render detail', params)
  useEffect(() => {
    console.log('mount detail', params)
    return () => {
      console.log('unmount detail')
    }
  }, [])
  return (
    <div className="test">
      home detail page
      <br />
      <Link to="/home">home</Link>
      <br />
      <Link to="/home/1">home/1</Link>
      <br />
      <Link to={`/home/detail/${getRandomInt(10, 100)}`}>home/detail/xxxx</Link>
      <br />
      <Link to="/list">list</Link>
    </div>
  )
}
export default Index
