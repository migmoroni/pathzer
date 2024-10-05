/**
 * @license pathzer.js v0.1
 *
 * Copyright (c) 2024, Miguel Eduardo Senna Moroni
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 * Allow this project to continue. Visit our website: github.com/migmoroni/pathzer
 **/

/**
 *
 * EN-US: This program allows you to perform analyzes on a provided path, 
 * allowing you to return an array with the mapping of all folders and files in a hierarchical manner, 
 * but you can also organize and filter this data, depending on your needs.
 * 
 * PT-BR: Este programa permite realizar análises em um caminho fornecido, 
 * permitindo retornar um array com o mapeamento de todas as pastas e arquivos de forma hierárquica, 
 * mas você também pode organizar e filtrar esses dados, dependendo da sua necessidade.
 *
 */

const readPath = require('./lib/readPath');
const orgPathExt = require('./lib/orgPathExt');
const orgPathFolder = require('./lib/orgPathFolder');

const filterPath = require('./lib/filterPath');

// Obtém os argumentos da linha de comando
const args = process.argv.slice(2);

// Obter o caminho absoluto do diretório onde o script foi chamado, por padrão
let pathBase = process.cwd();

//Código voltado ao uso de Terminal...

//Código voltado a API
function pathzer(obj, mode = 1, process){

    switch(mode){
        case 1:
            return readPath(obj);
            
        case 2:
            readPath(obj).then(result => {
                result = orgTreeArrayPath(result);
                console.log(result);
                return result;
            });
            break;

        case 3:
            readPath(obj).then(result => {
                result = orgFolderExtensionPath(result);
                return result;
            });
            break;

        case 4:
            let objAux = [];
            readPath(obj).then(result => {
                result = orgFolderExtensionPath(result);
                result.forEach((line) => {
                    let {path, folders, files} = filterPath(line);
                    objAux.push(path, folders, files);
                });
                console.log(objAux)
                return objAux;
        
            }).catch(error => {
                console.error("Read error:", error);
            });
            break;

        case 31:
            readPath(obj).then(result => {
                result = orgFolderExtensionPath(result);
                console.log(result)
                result.forEach((line) => {
                    let {path, folders, files} = filterPath(line);
                    process(path, folders, files);
                });
        
            }).catch(error => {
                console.error("Read error:", error);
            });
            break;
            
        default:
            console.log(`Not know: ${mode}`);
            showHelp();
            break;
    }
}

module.exports = pathzer;