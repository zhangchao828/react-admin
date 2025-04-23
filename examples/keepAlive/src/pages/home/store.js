import { makeAutoObservable } from '@glcc/admin'

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
