const STATUS = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED'
}

function resolvePromise(x, promise2, resolve, reject) {
  if (x === promise2) {
    // 防止自己等待自己完成
    reject(new TypeError('error'))
  }
  // 如果x是promise，采用这个promise的状态作为promise2的状态
  // 如果x是普通值，直接调用resolve
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    let called = false
    // 判断x是否是一个thenable对象，有的话就认为它是一个promise
    try {
      // 取then时有可能会抛出异常，如果异常按失败处理
      let then = x.then
      if (typeof then === 'function') {
        // 如果是promise，执行它得到它的状态，并把它的返回值传给promise2的then
        then.call(x, (y) => {
          if (called) return
          called = true
          // resolve(y)
          resolvePromise(y, promise2, resolve, reject) // 递归调用解析后的值，知道他是一个普通值为止
        }, (r) => {
          if (called) return
          called = true
          reject(r)
        })
      }
    } catch (error) {
      if (called) return
      called = true
      reject(error)
    }
  } else {
    resolve(x)
  }
}

class Promise {
  constructor(executor) {
    this.status = STATUS.PENDING
    this.value = undefined
    this.reason = undefined
    this.onResoleveCallbacks = []
    this.onRejectCallbacks = []
    const resolve = (val) => {
      if (val instanceof Promise) {
        return val.then(resolve, reject)
      }
      if (this.status === STATUS.PENDING) {
        this.status = STATUS.FULFILLED
        this.value = val
        this.onResoleveCallbacks.forEach(fn => fn())
      }
    }
    const reject = (reason) => {
      if (this.status === STATUS.PENDING) {
        this.status = STATUS.REJECTED
        this.reason = reason
        this.onRejectCallbacks.forEach(fn => fn())
      }
    }
    try {
      executor(resolve, reject)
    } catch(e) {
      // 如果抛出异常按照失败来处理
      reject(e)
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : data => data
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err }

    let promise2 = new Promise((resolve, reject) => {
      if (this.status === STATUS.FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            resolvePromise(x, promise2, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      }
      if (this.status === STATUS.REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(x, promise2, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      }
      if(this.status === STATUS.PENDING) {
        // 装饰器模式（切片编程）
        this.onResoleveCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value)
              resolvePromise(x, promise2, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0)
        })
        this.onRejectCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(x, promise2, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0)
        })
      }
    })
    return promise2
  }
  catch(err) {
    return this.then(null, err)
  }
  finally(callback) {
    return this.then((data) => {
      // 等callback执行完后再把结果传给下一个then
      return Promise.resolve(callback()).then(() => data)
    },err => {
      return Promise.resolve(callback()).then(() => { throw err })
    })
  }
  static resolve(val) {
    return new Promise((resolve, reject) => {
      resolve(val)
    })
  }
  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }
  static all(promises) {
    return new Promise((resolve, reject) => {
      function isPromise(p) {
        return p && (typeof p.then === 'function')
      }
      let result = []
      let times = 0
      function processData(index, val) {
        result[index] = val
        if (++times === promises.length) {
          resolve(result)
        }
      }
      for (let i = 0; i < promises.length; i++) {
        let p = promises[i]
        if (isPromise(p)) {
          p.then((data) => {
            processData(i, data)
          }, reject)
        } else {
          processData(i, p)
        }
      }
    })
  }
}

// 测试方法
Promise.defer = Promise.deferred = function() {
  let dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}

module.exports = Promise