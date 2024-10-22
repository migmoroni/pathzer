// Função para organizar arquivos por extensão a partir do objeto fornecido
function organizeFilesByExtension(input, mode = 'e') {
    const extensionsMap = {};

    let root = true;
    let rootPath = '';
    const e = 'root';
    extensionsMap[e] = [];
    function processItem(item, mode, currentPath = '') {
        if (typeof item === 'string') {
            // Se for um arquivo (string com extensão)
            if (root) {rootPath = currentPath; extensionsMap[e].push(rootPath); root = false}
            currentPath = currentPath.replace(rootPath, '')

          
            if (mode === 'e'){
                const {ext, path} = byExtension(item, currentPath)
                usePush(ext, path)
            }
            if (mode === 's'){
                const {ext, path} = bySize(item, currentPath)
                usePush(ext, path)
            }
            if (mode === 'n'){
                const {ext, path} = byName(item, currentPath)
                usePush(ext, path)
            }

            function usePush(){
                if (!extensionsMap[ext]) {
                    extensionsMap[ext] = [];        
                }
                extensionsMap[ext].push(path);
            }
      
            item = item.replace(/{[^}]*}/g, '').replace(';', '').trim()
            // Adicionar o arquivo ao mapa de extensões
            
        } else if (Array.isArray(item)) {
            // Processar cada item do array
            item.forEach((subItem, index) => {
                if (typeof subItem === 'string' && Array.isArray(item[index + 1])) {
                    // Se o próximo item for um array, subItem é uma pasta
                    const newPath = `${currentPath}/${subItem}`; // Atualiza o caminho com a pasta
                    processItem(item[index + 1], mode, newPath); // Processa o conteúdo da pasta
                } else if (!Array.isArray(subItem)) {
                    // Caso contrário, processa normalmente como arquivo
                    processItem(subItem, mode, currentPath);
                }
            });
        }
    }

    // Processar o item de entrada
    processItem(input, mode);

    return extensionsMap;
}

// Função para formatar a saída
function formatOutput(extensionsMap) {
    let result = [];

    Object.keys(extensionsMap).forEach(ext => {
        const files = extensionsMap[ext].join('","');
        result.push(`[${ext},["${files}"]]`);
    });

    return result;
}

function byExtension(item, currentPath){
    let newItem = item.replace(/{[^}]*}/g, '').replace(';', '').trim()
    const path = `${currentPath}/${newItem}`; // Montar o caminho completo
    const ext = newItem.split('.').pop(); // Extrair a extensão

    return {ext, path}
}

// Exemplo de uso
const input = [
      "Projetos/Pessoais/main/files/src",
      [
        "Readme.md;",
        "index2.html;",
        "language",
        [
          "es-1.json;",
          "index.html; ",
          "index.js;",
          "output.css;",
          "test.html;",
          "english",
          [
            "en.txt; {info-(0.000 MB)-info}",
            "en.xml; {info-(0.000 MB)-info}"
          ],
          "portuguese",
          [
            "pt.txt; {info-(0.000 MB)-info}"
          ]
        ],
        "text",
        [
          "text.txt; {info-(0.000 MB)-info}"
        ]
      ]
    ];

const organizedFiles = organizeFilesByExtension(input);
const formattedOutput = formatOutput(organizedFiles);

// Imprimir a saída
console.log(formattedOutput.join('\n'));
