import { history, useAppContext, useActive, observer, makeAutoObservable, http } from '@glcc/admin'

class Store {
  constructor() {
    makeAutoObservable(this)
  }
  num = 0
  setNum = () => {
    this.num++
  }
}
const remoteStore = new Store()
function Index({ props: { store } }) {
  const { num } = remoteStore
  const { count } = store || {}
  const { main, ...rest } = useAppContext()
  console.log('remote data', main, rest)
  useActive((active) => {
    console.log('remote index active', active)
  })
  return (
    <div>
      <div>count </div>
      3001 remote index page
      <div
        onClick={() => {
          console.log(history)
          history.push('/home')
        }}
      >
        home
      </div>
      <div
        onClick={() => {
          // main.context.history.push('/home')
          main.context.setAppData({ name: 'remote click' })
        }}
      >
        aaaaa
      </div>
      <button
        onClick={() => {
          return http('/api/remote', {
            method: 'post',
            data: { name: 'aa' },
          })
        }}
      >
        http
      </button>
      <div>num: {num}</div>
      <div>count:{count}</div>
    </div>
  )
}
export default observer(Index)
