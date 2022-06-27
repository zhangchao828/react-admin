import { observer, Link } from 'zs-admin'

function Index() {
  return (
    <div className="test">
      Index page
      <br />
      <Link to="/home">home</Link>
      <br />
      <Link to="/home/1">home/id</Link>
    </div>
  )
}
Index.title = 'Index'

export default observer(Index)
