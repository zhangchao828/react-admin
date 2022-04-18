import { makeAutoObservable } from '@zc/admin'

class Store {
  constructor() {
    makeAutoObservable(this)
  }
  count = 0
  changeCount = () => {
    this.count++
  };

  *getList() {
    yield new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 2000)
    })
    this.count = 10
    this.count++
  }
}

export default new Store()
