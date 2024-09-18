const fsp = require('fs/promises');
const path = require('path');
const fs = require('fs');

// VARREDURA DE ARQUIVOS A SEREM ANALISADOS

// Array 2D que vai armazenar as saídas
const multiplePartsArray = [];

// Função que processa um arquivo, filtrando apenas arquivos e enviando um array com o caminho separado de cada pasta
async function processFile(filePath, directoryPath) {
    // Verifica se o caminho é um arquivo
    const fileStat = await fsp.stat(filePath);
    if (!fileStat.isFile()) {
        return;
    }

    // Divide o caminho do arquivo em um array de pastas
    const relativePath = path.relative(directoryPath, filePath);
    const pathParts = relativePath.split(path.sep);

    // Retorna as partes do caminho e o caminho do arquivo
    return {
        filePath,
        pathParts
    };
}

// Função que processa todos os arquivos dentro de um diretório específico
async function processFilesInDirectory(directoryPath, rootPath) {
    const files = await fsp.readdir(directoryPath, { withFileTypes: true });
    const fileDetails = [];

    for (const file of files) {
        const filePath = path.join(directoryPath, file.name);
        if (file.isFile()) {
            const details = await processFile(filePath, rootPath);
            if (details) {
                fileDetails.push(details);
            }
        }
    }

    if (fileDetails.length > 0) {
        let acfiles = JSON.stringify(fileDetails.map(details => details.pathParts))
        // Chama a nova função com os detalhes dos arquivos
        await accessFiles(acfiles, rootPath);
    }
}

// Função que itera recursivamente pelos subdiretórios e processa seus arquivos
async function processDirectoriesRecursively(directoryPath, rootPath) {
    const directories = await fsp.readdir(directoryPath, { withFileTypes: true });
    for (const directory of directories) {
        const dirPath = path.join(directoryPath, directory.name);
        
        if (directory.isDirectory()) {
            await processFilesInDirectory(dirPath, rootPath);
            await processDirectoriesRecursively(dirPath, rootPath);
        }
    }
}

// Função para acessar arquivos usando a localização fornecida
async function accessFiles(jsonString, rootPath) {
    const fileDetails = JSON.parse(jsonString);
    const uniquePartsSet = new Set();

    fileDetails.forEach(parts => {
        parts.forEach(part => {
            uniquePartsSet.add(part);
        });
    });

    const uniquePartsArray = Array.from(uniquePartsSet);

    console.log(uniquePartsArray)

    // Adiciona a saída ao array 2D
    multiplePartsArray.push(uniquePartsArray);
}

function readRootFiles(dirPath) {
    const result = [];
  
    // Lê o conteúdo do diretório
    const files = fs.readdirSync(dirPath);
  
    files.forEach(file => {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isFile()) {
        result.push(file); // Adiciona apenas os arquivos
      }
    });

    multiplePartsArray.push(result);
    //console.log(multiplePartsArray)
}

/**
 * Lê todos os arquivos da hierarquia do path e os retorna para serem processados
 * 
 * @param {String} pathSource - A operação para onde deve ser processado os arquivos
 * 
 * @api public
 */
/*
function readPath(pathSource) {

    return (async () => {
        const rootDirectory = pathSource; // Substitua pelo caminho do seu diretório raiz
        await processDirectoriesRecursively(rootDirectory, rootDirectory);

        readRootFiles(rootDirectory);
        //console.log(multiplePartsArray)
        return multiplePartsArray;
    })(); // Retorna a promise gerada pela função async imediatamente

}
*/
async function readPath(pathSource) {
    //console.log(pathSource)
    const rootDirectory = pathSource; // Substitua pelo caminho do seu diretório raiz
    await processDirectoriesRecursively(rootDirectory, rootDirectory); // Espera o processamento recursivo

    // Chama readRootFiles depois que todo o processamento dos subdiretórios estiver concluído
    readRootFiles(rootDirectory);

    // Retorna o array com os arquivos e diretórios processados
    return multiplePartsArray;
}

module.exports = readPath;