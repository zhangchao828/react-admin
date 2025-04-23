import { history } from '@glcc/admin'

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
