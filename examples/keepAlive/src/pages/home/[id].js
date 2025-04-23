import { Link, useActive, observer } from '@glcc/admin'

function Index({ params }) {
  console.log('render /home/id', params)
  const active = useActive()
  console.log('home/id active', active)
  // useEffect(() => {
  //   console.log('useEffect home/id', params.id)
  //   return () => {
  //     console.log('unmount home/id')
  //   }
  // }, [params.id])
  // useActive((active) => {
  //   console.log('active detail', active)
  // })
  return (
    <div>
      Home/id {params.id}
      <input type="text" />
      <br />
      <Link to="/">index</Link>
      <br />
      <Link to="/home">home</Link>
      <br />
      <Link to="/home/detail/1">home/detail/1</Link>
      <br />
      <Link to="/home/age">home/age</Link>
      <br />
      <Link to="/list">list</Link>
    </div>
  )
}

export default observer(Index)
