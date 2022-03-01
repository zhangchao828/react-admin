const PENDING = 'pending' // 初始态
const FULFILLED = 'fulFilled' // 成功态
const REJECTED = 'rejected' // 失败态

class MyPromise {
  status = PENDING
  onResolvedCallbacks = []
  onRejectedCallbacks = []
  constructor(callback) {
    const resolve = (value) => {
      if (value instanceof Promise) {
        return value.then(resolve, reject)
      }
      if (this.status === PENDING) {
        this.status = FULFILLED
        this.value = value // 成功后会得到一个值，这个值不能改
        this.onResolvedCallbacks.forEach((cb) => cb(this.value))
      }
    }
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.value = reason // 失败的原因 给value
        this.onRejectedCallbacks.forEach((cb) => cb(this.value))
      }
    }
    try {
      callback(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled == 'function' ? onFulfilled : (value) => value
    onRejected =
      typeof onRejected == 'function'
        ? onRejected
        : (reason) => {
            throw reason
          }
    let promise
    if (this.status === PENDING) {
      return (promise = new MyPromise((resolve, reject) => {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const res = onFulfilled(this.value)
              this.resolvePromise(promise, res, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const res = onRejected(this.value)
              this.resolvePromise(promise, res, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
      }))
    }
    if (this.status === FULFILLED) {
      return (promise = new MyPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            const res = onFulfilled(this.value)
            this.resolvePromise(promise, res, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }))
    }
    if (this.status === REJECTED) {
      return (promise = new MyPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            const res = onRejected(this.value)
            this.resolvePromise(promise, res, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }))
    }
  }
  catch(onRejected) {
    return this.then(null, onRejected)
  }
  resolvePromise(promise, value, resolve, reject) {
    // let called = false
    if (promise === value) {
      return reject(new TypeError('循环引用'))
    }
    if (typeof value === 'function' && value.then && typeof value.then === 'function') {
      try {
        const then = value.then
        then.call(
          value,
          (y) => {
            // if (!called) {
            //   called = true
            //   then.resolvePromise(promise, y, resolve, reject)
            // }
            then.resolvePromise(promise, y, resolve, reject)
          },
          (err) => {
            // if (!called) {
            //   called = true
            //   reject(err)
            // }
            reject(err)
          }
        )
      } catch (e) {
        // if (!called) {
        //   called = true
        //   reject(e)
        // }
        reject(e)
      }
    } else {
      // if (!called) {
      //   called = true
      //   resolve(value)
      // }
      resolve(value)
    }
  }
}

export default function test() {
  new MyPromise((resolve) => {
    // const a = {}
    // a.b()
    resolve()
  })
    .then(
      () => {
        console.log('then1')
      },
      () => {
        console.log('catch')
      }
    )
    .then(() => {
      console.log('then2')
    })
    .catch(() => {
      const obj = {}
      console.log('catch1')
      obj.test()
    })
    .then(
      () => {
        console.log('then3')
      },
      () => {
        const obj = {}
        console.log('catch2')
        obj.test()
      }
    )
    .catch(() => {
      console.log('catch3')
    })
}
