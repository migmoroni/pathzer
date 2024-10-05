const fs = require('fs');
const path = require('path');

// Função para contar diretórios principais e primeiros subdiretórios
function countDirectories(dirPath) {
    const items = fs.readdirSync(dirPath);
    let directoryCount = 0;

    items.forEach(item => {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            directoryCount++; // Conta o diretório principal
            const subItems = fs.readdirSync(fullPath);

            subItems.forEach(subItem => {
                const subFullPath = path.join(fullPath, subItem);
                const subStat = fs.statSync(subFullPath);

                if (subStat.isDirectory()) {
                    directoryCount++; // Conta o subdiretório de primeiro nível
                }
            });
        }
    });

    return directoryCount;
}

// Função principal para processar o diretório e seus arquivos
function processDirectory(dirPath, progressCounter) {
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
        progressCounter.count++; // Incrementa o contador a cada diretório processado

        // Atualiza a mesma linha no terminal
        process.stdout.write(`\rProcessando diretório ${progressCounter.count} de ${progressCounter.total}...`);

        const folderName = directory; // Nome da pasta sem extensão
        result.push(folderName, processDirectory(path.join(dirPath, directory), progressCounter));
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
    const totalDirectories = countDirectories(dirPath); // Conta o número total de diretórios e subdiretórios
    console.log(`Total de diretórios principais e primeiros subdiretórios: ${totalDirectories}`);

    const progressCounter = { count: 0 }; // Inicializa o contador de progresso

    const result = processDirectory(dirPath, progressCounter);
    console.log(); // Pula para a próxima linha após terminar o progresso
    return formatResult(dirPath, formatter, result);
}

// Exemplo de chamada da função
const dirPath = '/home/miguel/Projetos/Externos/GameGuild/website';
const formatter = 2; // Teste com formatter 0, 1 ou 2
const fileSystemStructure = readPath(dirPath, formatter);

//console.log(JSON.stringify(fileSystemStructure, null, 2));

module.exports = readPath;
