const pathzer = require('../pathzer')

console.log(pathzer("?=/home/miguel/Documentos/"))
console.log(JSON.stringify(pathzer("?=/home/miguel/Documentos/"), null, 2))

console.log(JSON.stringify(pathzer("?=/home/miguel/Doc"), null, 2))