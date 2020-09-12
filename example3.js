let Promise = require('./promise/promise.js')

let p = new Promise((resolve, reject) =>  {
  reject('ok')
})
p.then().then().then().then((data) => {
  console.log(data)
})