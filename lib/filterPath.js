function main(input, foldersToKeep) {
    // Função auxiliar recursiva para manter apenas as pastas informadas em cada nível
    function filterLevel(path, content, level) {
        if (!Array.isArray(content)) {
            return content;
        }

        // Se o nível atual for maior que o número de pastas a serem mantidas, apenas retorna o conteúdo atual
        if (level >= foldersToKeep.length) {
            return content;
        }

        const folderToKeep = foldersToKeep[level].toLowerCase(); // Pasta a ser mantida neste nível

        return content.reduce((filteredContent, item) => {
            if (Array.isArray(item)) {
                // Se o item for uma subpasta, verificar se deve ser mantido
                const folderName = item[0].toLowerCase(); // Nome da pasta
                if (folderName === folderToKeep) {
                    // Mantém a pasta e filtra seu conteúdo recursivamente
                    filteredContent.push([item[0], filterLevel(item[0], item.slice(1), level + 1)]);
                }
            } else {
                // Se for um arquivo e estamos dentro da pasta correta, mantém o arquivo
                filteredContent.push(item);
            }
            return filteredContent;
        }, []);
    }

    // Inicia o processo de filtragem no nível inicial
    const [rootPath, rootContent] = input;
    const filteredResult = [rootPath, filterLevel(rootPath, rootContent, 0)];

    return filteredResult;
}

/**
 * @function readPath
 * @param {String} result 
 * @param  {Array} param 
 * @returns {Object[]} result
 */
function filterPath(result, ...param){

  if (result.length != 0){
        for (let i = 0; i < (result.length); i++) {
        switch (param[0]) {
            case 'p':
                result[i] = main(result[i], "text");
                break;
            case 'c':
                result[i] = main(result[i], ...param.slice(1));
                break;
            default:
                result[i];
        }   
            
        }
    } else {
        obs = ["Result not found"]
    }
    return [result];
}

module.exports = filterPath;

/*
Result é analisado
modos:
Filtro de diretório
"kdn" => keep directory name (inclui apenas o diretório informado)
"ddn" => delete directory name (exclui apenas o diretório informado)

Filtro de arquivos
"kfn" => keep file name (inclui apenas o arquivo informado)
"dfn" => delete file name (exclui apenas o arquivo informado)

Filtro de extensão
"kfe" => keep file extension (inclui apenas o arquivo informado)
"dfe" => delete file extension (exclui apenas o arquivo informado)

*/