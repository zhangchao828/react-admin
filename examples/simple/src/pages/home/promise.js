const PENDING = 'pending' // 初始态

const FULFILLED = 'fulFilled' // 成功态

const REJECTED = 'rejected' // 失败态

function Promise(exector) {
  let self = this // 先缓存当前的 Promise实例

  self.status = PENDING // 设置状态

  self.onResolvedCallbacks = [] // 定义存放成功回调的数组

  self.onRejectedCallbacks = [] // 定义存放失败回调的数组

  function resolve(value) {
    if (value instanceof Promise) {
      return value.then(resolve, reject)
    }

    //  当调用此方法的时候，如果是pending状态，则转成 成功态

    if (self.status === PENDING) {
      self.status = FULFILLED

      self.value = value // 成功后会得到一个值，这个值不能改

      // 调用所有成功的回调

      self.onResolvedCallbacks.forEach((cb) => cb(self.value))
    }
  }

  function reject(reason) {
    // 如果是初始态，则转成失败态

    if (self.status === PENDING) {
      self.status = REJECTED

      self.value = reason // 失败的原因 给value

      // 调用所有失败的回调

      self.onRejectedCallbacks.forEach((cb) => cb(self.value))
    }
  }

  try {
    exector(resolve, reject) // 因为此函数执行的时候，可能出异常，所以需要捕获，如果出错了，需要用错误对象Reject
  } catch (e) {
    reject(e) // 如果执行失败了，用失败的原因reject这个Promise
  }
}

// onFulfilled用来接收Promise成功的值或失败的原因

Promise.prototype.then = function (onFulfilled, onRejected) {
  // 如果成功和失败的回调没有传，则表示这个then没有任何逻辑，只会把值往后抛

  onFulfilled = typeof onFulfilled == 'function' ? onFulfilled : (value) => value

  onRejected =
    typeof onRejected == 'function'
      ? onRejected
      : (reason) => {
          throw reason
        }

  let self = this

  let promise2

  // 如果当前的Promise状态已经是成功态了，onFulfilled直接取值

  if (self.status === FULFILLED) {
    return (promise2 = new Promise(function (resolve, reject) {
      setTimeout(function () {
        try {
          let x = onFulfilled(self.value)

          // 如果获取到了返回值，会走解析Promise的过程

          resolvePromise(promise2, x, resolve, reject)
        } catch (e) {
          // 如果执行成功的回调中出问题了，用错误原因把promise2 reject

          reject(e)
        }
      })
    }))
  }

  if (self.status === REJECTED) {
    return (promise2 = new Promise(function (resolve, reject) {
      setTimeout(function () {
        try {
          let x = onRejected(self.value)

          resolvePromise(promise2, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })
    }))
  }

  if (self.status === PENDING) {
    return (promise2 = new Promise(function (resolve, reject) {
      self.onResolvedCallbacks.push(function () {
        setTimeout(function () {
          try {
            let x = onFulfilled(self.value)

            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      })

      self.onRejectedCallbacks.push(function () {
        setTimeout(function () {
          try {
            let x = onRejected(self.value)

            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      })
    }))
  }

  function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
      return reject(new TypeError('循环引用'))
    }

    let called = false // 用于判断promise2是否已经resolve或reject

    if (x != null && (typeof x == 'object' || typeof x === 'function')) {
      // 以下代码 主要用于我们的Promise和别人的Promise进行交互，编写这种代码，要考虑到

      // 兼容性，允许别人出错

      try {
        let then = x.then

        if (typeof then == 'function') {
          // 有些promise会同时执行成功和失败的回调

          then.call(
            x,
            function (y) {
              // 如果promise2已经成功或者失败了，则不需要再处理了

              if (called) return

              called = true

              resolvePromise(promise2, y, resolve, reject)
            },
            function (err) {
              if (called) return

              called = true

              reject(err)
            }
          )
        } else {
          // 如果promise2已经成功或者失败了，则不需要再处理了

          if (called) return

          called = true

          // 到此的话 x 不是一个 thenable对象，那直接把他rosolve掉

          resolve(x)
        }
      } catch (e) {
        if (called) return

        called = true

        reject(e)
      }
    } else {
      // 如果promise2已经成功或者失败了，则不需要再处理了

      if (called) return

      called = true

      // 如果x 是一个普通的值，就用x的值去resolve promise2

      resolve(x)
    }
  }
}

Promise.prototype.catch = function (onRejected) {
  // catch 的原理就是只传失败的回调

  this.then(null, onRejected)
}

Promise.deferred = Promise.defer = function () {
  let defer = {}

  defer.promise = new Promise(function (resolve, reject) {
    defer.resolve = resolve

    defer.reject = reject
  })

  return defer
}

export default function test() {
  new Promise((resolve) => {
    resolve(1)
  })
    .then((res) => {
      console.log(res)
      return new Promise((re) => {
        re()
      }).then(() => 4)
    })
    .then((res) => {
      console.log(res)
    })
}
