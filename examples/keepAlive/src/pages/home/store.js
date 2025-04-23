import { makeAutoObservable } from '@zswl/admin'

class Store {
  constructor() {
    makeAutoObservable(this)
  }
  count = 0
  setCount = () => {
    this.count++
  }
}
export default new Store()
