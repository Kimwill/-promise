const Promise = require('./promise/promise.js')

/**
 * 1、finally中传入的函数，无论如何都会执行
 * 2、如果想在then链中加入一段一定要执行的逻辑，可以用finally
 * 3、finally方法中的函数的参数是拿不到前一个then的返回值的，finally后面的then会拿到前一个then的返回值
 * 4、finally中可以返回一个promise，下一个then会等待finally中的promise状态改变再执行，如果resolve，那么会调用下一个then的resolve，如果reject，会调用下一个then的reject
 */
Promise.resolve('123').finally((data) => {
  // console.log('finally')
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('ok')
      // reject('failed')
    }, 2000)
  })
}).then(data => {
  console.log('s', data)
}, err => {
  console.log('f', err)
})