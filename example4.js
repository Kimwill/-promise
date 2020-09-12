let Promise = require('./promise/promise.js')
let fs = require('fs')

function read(...args) {
  // return new Promise((resolve, reject) => {
  //   fs.readFile('./name.txt', 'utf8', function(err, data) {
  //     if (err) reject(err)
  //     resolve(data)
  //   })
  // })
  const dfd = Promise.defer()
  fs.readFile('./name.txt', 'utf8', (err, data) => {
    if (err) dfd.reject(err)
    dfd.resolve(data)
  })
  return dfd.promise
}

read().then((data) => {
  console.log(data)
})