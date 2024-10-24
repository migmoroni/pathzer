const fs = require('fs');
const path = require('path');

/**
 * Função para sanitizar o conteúdo de texto, removendo caracteres indesejados.
 * @param {string} content - O conteúdo a ser sanitizado.
 * @returns {string} O conteúdo sanitizado.
 */
function sanitizeContent(content) {
    // Remove quebras de linha e outros caracteres indesejados
    return content.replace(/[\n\r]+/g, ' ').trim(); // Troca quebras de linha por espaços
}

/**
 * Função para procurar arquivos com extensões específicas e retornar seus nomes e conteúdos.
 * @param {string} dir - O diretório para procurar os arquivos.
 * @param {string} ext - As extensões dos arquivos a serem procurados, separadas por vírgula.
 * @param {boolean} hi - Se true, lê arquivos em subpastas; se false, lê apenas arquivos no diretório atual.
 * @returns {Object} Um objeto com as extensões como chaves e seus arquivos e conteúdos.
 */
function findFilesWithExtensions(dir, ext, hi = false) {
    const extensions = ext.split(',').map(e => e.trim());
    const result = {};

    extensions.forEach(extension => {
        const filesWithContent = [];
        
        // Lê o conteúdo do diretório
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const fileStat = fs.statSync(filePath);
            const fileExt = path.extname(file).slice(1); // Remove o ponto da extensão
            
            // Se o arquivo tem a extensão correspondente e é um arquivo normal
            if (extension === fileExt && fileStat.isFile()) {
                const content = fs.readFileSync(filePath, 'utf-8'); // Lê o conteúdo do arquivo
                const sanitizedContent = sanitizeContent(content); // Sanitiza o conteúdo
                filesWithContent.push([file, [sanitizedContent]]); // Mantém o conteúdo como uma string
            } else if (hi && fileStat.isDirectory()) {
                // Se hi é true e é um diretório, chama a função recursivamente
                const subDirResult = findFilesWithExtensions(filePath, ext, hi);
                // Mescla os resultados recursivos
                Object.entries(subDirResult).forEach(([subExt, subFiles]) => {
                    if (!result[subExt]) {
                        result[subExt] = [];
                    }
                    result[subExt].push(...subFiles);
                });
            }
        });

        // Adiciona os arquivos encontrados ao resultado
        if (filesWithContent.length > 0) {
            result[extension] = filesWithContent;
        }
    });

    return result;
}

/**
 * Função que converte um objeto JSON em um formato TREE (arrays aninhados).
 * @param {Object} json - O objeto JSON a ser convertido.
 * @returns {Array} O array no formato TREE.
 */
function jsonToTree(json) {
    const tree = [];

    // Itera sobre as chaves do objeto JSON
    for (const [extension, files] of Object.entries(json)) {
        const filesArray = [];

        // Itera sobre os arquivos e seus conteúdos
        for (const [fileName, content] of files) {
            // Mantém o conteúdo como uma string
            filesArray.push([fileName, [content[0]]]); // Coloca o conteúdo como um único item no array
        }

        // Adiciona a extensão e os arquivos encontrados ao tree
        tree.push([extension, filesArray]);
    }

    return tree;
}

// Exemplo de uso
const directoryPath = '/home/miguel/Projetos/Pessoais/pathzer/rootTest'; // Substitua pelo seu diretório
const extensions = 'json'; // Extensões a serem procuradas
const jsonResult = findFilesWithExtensions(directoryPath, extensions, true); // hi = true para buscar em subpastas
const treeResult = jsonToTree(jsonResult); // Converte o resultado JSON para TREE

console.log(JSON.stringify(treeResult, null, 2)); // Imprime o resultado formatado
