const fs = require('fs');
const path = require('path');

// Função principal para processar o diretório e seus arquivos
function processDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);
    const result = [];
    const directories = [];

    // Primeiro processa todos os arquivos
    items.forEach(item => {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isFile()) {
            result.push(item); // Adiciona o arquivo diretamente ao resultado
        } else if (stat.isDirectory()) {
            // Se for um diretório, armazena para processar depois
            directories.push(item);
        }
    });

    // Agora processa as pastas (diretórios) após os arquivos
    directories.forEach(directory => {
        const folderName = directory; // Nome da pasta sem extensão
        result.push(folderName, processDirectory(path.join(dirPath, directory)));
    });

    return result;
}

// Função para adicionar o root de acordo com o valor de formatter
function formatResult(baseDir, formatter, result) {
    switch (formatter) {
        case 0:
            // Sem root, apenas a estrutura de arquivos/pastas
            return result;
        case 1:
            // Inclui apenas a pasta root
            const rootName = path.basename(baseDir); // Último nome do diretório base
            return [rootName, result];
        case 2:
            // Inclui o caminho completo do root
            return [baseDir, result];
        default:
            throw new Error("Formatter inválido. Use 0, 1 ou 2.");
    }
}

// Função que inicia o processo a partir de um caminho fornecido
function readPath(dirPath, formatter = 0) {
    const result = processDirectory(dirPath);
    return formatResult(dirPath, formatter, result);
}

// Exemplo de chamada da função
const dirPath = '/home/miguel/Projetos/Pessoais/main/files/src';
const formatter = 2; // Teste com formatter 0, 1 ou 2
const fileSystemStructure = readPath(dirPath, formatter);

console.log(JSON.stringify(fileSystemStructure, null, 0));

module.exports = readPath;
