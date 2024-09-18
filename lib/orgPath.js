/**
 * Organiza o retorno, separando arquivos de extensões diferentes
 * 
 * @param {String} pathSource - A operação para onde deve ser processado os arquivos
 * 
 * @api public
 */

function orgPath(array2D) {
    const result = [];

    array2D.forEach(line => {
        // Copiamos os primeiros elementos da linha que não devem ser alterados
        const [...rest] = line;

        // Separando arquivos do resto dos elementos
        const files = rest.filter(item => item.includes('.'));

        // Cria um objeto para agrupar arquivos por extensão
        const filesByExtension = {};

        files.forEach(file => {
            const extension = file.split('.').pop();
            if (!filesByExtension[extension]) {
                filesByExtension[extension] = [];
            }
            filesByExtension[extension].push(file);
        });

        // Adiciona ao resultado as novas linhas para cada grupo de extensão
        Object.values(filesByExtension).forEach(group => {
            result.push([...rest.filter(item => !item.includes('.')), ...group]);
        });
    });

    return result;
}

module.exports = orgPath;