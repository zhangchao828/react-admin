import { history } from '@zswl/admin'

export default function Home() {
  return (
    <div>
      3002 remote home
      <div
        onClick={() => {
          history.push('/detail/1')
        }}
      >
        home
      </div>
    </div>
  )
}
