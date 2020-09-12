const fs = require('fs')
const Promise = require('./promise/promise.js')

function read(...args) {
  return new Promise((resolve, reject) => {
    // fs.readFile(...args, (err, data) => {
    //   if (err) return reject(err)
    //   resolve(data)
    // })
    resolve()
  })
}
/**
 * promise中的链式调用
 * 1、如果then方法中（成功或失败）返回的不是一个promise，会将这个返回值传递给外层下一次then的成功结果
 * 2、如果执行then方法中的方法出错了（抛出异常），会把这个错误传递给外层下一次then的失败结果
 * 3、如果返回的是一个promise，会把这个promise的结果作为下一个then的成功或失败
 * 4、如果then方法中的方法出错了，但下一个then没有错误处理函数，则会继续传递给下一个then的错误处理函数（catch），如果一直没处理就报错
 * 5、catch后面可以接着then（catch就是相当于then(null, () => {})）
 * 6、每次调用then方法都会返回一个新的promise实例（原先的promise状态已经变了，不能再改状态了）
 * 
 * 什么时候会走下一个then的失败？
 * 1、抛出异常
 * 2、返回的priomise出错
 * 
 * 如果有10个then，第一个就出错了，还会走接下来的9个then吗？
 * - 要看有没有捕获异常（处理错误），如果捕获了就会接着走then，没有就一直往下找catch
 * 
 * 链式调用如何中断？
 * - 返回一个既不成功也不失败的promise
 */

const p = read('./name.txt', 'utf8')
const promise2 = p.then((data) => {
  // throw new Error('err')
  // return 100
  return new Promise((resolve, reject) => {
    resolve(new Promise((resolve, reject) => {
      reject(100)
    }))
  })
}, (reason) => {
  return 200
})
promise2.then((data) => {
  console.log('s', data)
}, (err) => {
  console.log('f', err)
  return '11'
}).then((data) => {
  console.log(data)
})

// fs.readFile('./name.txt', 'utf8', (err, data) => {
//   fs.readFile(data, 'utf8', (err,data) => {
//     console.log(data)
//   })
// })