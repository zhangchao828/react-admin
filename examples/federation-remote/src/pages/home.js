import { history, useActive } from '@zswl/admin'

export default function Home({ children }) {
  useActive((active) => {
    console.log('remote home active', active)
  })
  return (
    <div>
      3001 remote home
      <div
        onClick={() => {
          history.push('/detail/1')
        }}
      >
        home
      </div>
      {children}
    </div>
  )
}
