/**
 * 解决了哪些问题
 * 1、异步并发处理问题（Promise.all）
 * 2、解决回调地狱
 * 3、错误处理非常方便
 * 
 * 缺陷：依旧是基于回调函数的
 * 
 * promise的特点
 * 1、Promise是一个类，类中的构造函数需要传入一个excutor，默认就会执行
 * 2、excutor有两个参数，分别是resolve和reject
 * 3、默认创建一个promise实例，状态就是pending，其他两个状态是fulfilled, reject
 * 4、如果成功了就不能失败，只能pendgin -> fulfilled(reject)
 * 5、如果抛出异常按照失败来处理
 */
const Promise = require('./promise/promise.js')

let p = new Promise((resolve, reject) => {
  // throw new Error('err')
  // resolve('success')
  // reject('failed')
  setTimeout(() => {
    reject('failed')
  }, 1000)
})
p.then((data) => {
  console.log(data)
}, (reason) => {
  console.log(reason)
})

p.then((data) => {
  console.log(data)
}, (reason) => {
  console.log(reason)
})