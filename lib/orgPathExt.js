// Função para organizar arquivos por extensão a partir do objeto fornecido
function organizeFilesByExtension(input) {
    const extensionsMap = {};

    function processItem(item, currentPath = '') {
        if (typeof item === 'string') {
            // Se for um arquivo (string com extensão)
            const path = `${currentPath}/${item}`; // Montar o caminho completo
            const ext = item.split('.').pop(); // Extrair a extensão

            // Adicionar o arquivo ao mapa de extensões
            if (!extensionsMap[ext]) {
                extensionsMap[ext] = [];
            }
            extensionsMap[ext].push(path);
        } else if (Array.isArray(item)) {
            // Processar cada item do array
            item.forEach((subItem, index) => {
                if (typeof subItem === 'string' && Array.isArray(item[index + 1])) {
                    // Se o próximo item for um array, subItem é uma pasta
                    const newPath = `${currentPath}/${subItem}`; // Atualiza o caminho com a pasta
                    processItem(item[index + 1], newPath); // Processa o conteúdo da pasta
                } else if (!Array.isArray(subItem)) {
                    // Caso contrário, processa normalmente como arquivo
                    processItem(subItem, currentPath);
                }
            });
        }
    }

    // Processar o item de entrada
    processItem(input);

    return extensionsMap;
}

// Função para formatar a saída
function formatOutput(extensionsMap) {
    let result = [];

    Object.keys(extensionsMap).forEach(ext => {
        const files = extensionsMap[ext].join('","');
        result.push(`[${ext} = "${files}"]`);
    });

    return result;
}

// Exemplo de uso
const input = ["src",["Readme.md","index2.html","language",["es-1.json","index.html","index.js","output.css","test.html","english",["en.txt","en.xml"],"portuguese",["pt.txt"]],"text",["text.txt"]]];

const organizedFiles = organizeFilesByExtension(input);
const formattedOutput = formatOutput(organizedFiles);

// Imprimir a saída
console.log(formattedOutput.join('\n'));
