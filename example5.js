const Promise = require('./promise/promise.js')

const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('ok')
  }, 1000)
})

// Promise.resolve可以等待一个promsie执行完成
Promise.resolve(p).then((data) => {
  console.log(data)
})

Promise.reject(p).catch(err => {
  console.log(err)
})