const pathzer = require('../pathzer')

console.log(pathzer("?"))
console.log(JSON.stringify(pathzer("?=/home/miguel/Documentos/"), null, 2))

console.log(JSON.stringify(pathzer("?=/home/miguel/Doc rp="), null, 2))