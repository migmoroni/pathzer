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
        for (const [fileName, content] of Object.entries(files)) {
            filesArray.push([fileName, [content[0]]]); // Adiciona o arquivo e seu conteúdo
        }

        // Adiciona a extensão e os arquivos encontrados ao tree
        tree.push([extension, filesArray]);
    }

    return tree;
}

// Exemplo de uso
const jsonInput = {
    "txt": {
        "example.txt": ["conteúdo aqui"],
        "example2.txt": ["conteúdo aqui"]
    },
    "json": {
        "example.json": ["conteúdo aqui"],
        "example2.json": ["conteúdo aqui"]
    }
};

const result = jsonToTree(jsonInput);
console.log(JSON.stringify(result, null, 2)); // Imprime o resultado formatado