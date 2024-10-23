const fs = require('fs');
const path = require('path');

/**
 * Função para procurar arquivos com extensões específicas e retornar seus nomes e conteúdos.
 * @param {string} dir - O diretório para procurar os arquivos.
 * @param {string} ext - As extensões dos arquivos a serem procurados, separadas por vírgula.
 * @param {boolean} hi - Se true, lê arquivos em subpastas; se false, lê apenas arquivos no diretório atual.
 * @returns {Array} Um array com o caminho e os arquivos encontrados e seus conteúdos.
 */
function findFilesWithExtensions(dir, ext, hi = false) {
    const extensions = ext.split(',').map(e => e.trim());
    const result = [dir];

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
                filesWithContent.push(file, [content]);
            } else if (hi && fileStat.isDirectory()) {
                // Se hi é true e é um diretório, chama a função recursivamente
                const subDirResult = findFilesWithExtensions(filePath, ext, hi);
                if (subDirResult.length > 1) {
                    // Ignora o primeiro elemento (caminho) se não houver arquivos correspondentes
                    result.push(...subDirResult.slice(1));
                }
            }
        });

        if (filesWithContent.length > 0) {
            result.push(filesWithContent);
        }
    });

    return result;
}

// Exemplo de uso
const directoryPath = '/home/miguel/Projetos/Pessoais/pathzer/rootTest/Brazil/Computer-Language'; // Substitua pelo seu diretório
const extensions = 'lua'; // Extensões a serem procuradas
const result = findFilesWithExtensions(directoryPath, extensions, false); // hi = true para buscar em subpastas
console.log(JSON.stringify(result, null, 2)); // Imprime o resultado formatado
