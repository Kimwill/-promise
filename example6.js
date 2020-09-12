const Promise = require('./promise/promise.js')
let fs = require('fs').promises

let getName = fs.readFile('./name.txt', 'utf8')
let getAge = fs.readFile('./age.txt', 'utf8')

Promise.all([1, getName, getAge, 2]).then((data) => {
  console.log(data)
})