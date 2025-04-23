import { history, http } from '@zswl/admin'

export default function Index() {
  return (
    <div>
      3002 remote index page
      <div
        onClick={() => {
          history.push('/home')
        }}
      >
        home
      </div>
      <div
        onClick={() => {
          http.get('/api')
        }}
      >
        http
      </div>
    </div>
  )
}
