// Função para organizar arquivos por extensão a partir do objeto fornecido
function organizeFilesByPath(input, mode = 'n4') {
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

            if (mode.startsWith("e")){
                const {ext, path} = byExtension(item, currentPath, mode.slice(1))
                usePush(ext, path)
            }
            if (mode.startsWith("s")){
                const {ext, path} = bySize(item, currentPath, mode.slice(1))
                usePush(ext, path)
            }
            if (mode.startsWith("n")){
                const {ext, path} = byName(item, currentPath, mode.slice(1))
                usePush(ext, path)
            }

            function usePush(ext, path){
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

function bySize(item, currentPath, mode){
    const match = item.match(/\(([\d.]+)\s*(GB|MB|KB|bytes)\)/);
    let newItem = item.replace(/{[^}]*}/g, '').replace(';', '').trim()
    const path = `${currentPath}/${newItem}`;
    if (match) {
        let size = parseFloat(match[1]);
        const unit = match[2];
    
        if (unit != 'KB') {
            if (unit === 'MB'){size *= 1024;}
            if (unit === 'GB'){size *= (1024 * 1024);}
            if (unit === 'bytes'){size /= 1024;}
        }
        if (size === 0) {size = '0.0'};

        if (mode === '1'){
            let sizeCategory;

            if (size < 10) {
                sizeCategory = "(__0 KB – _10 KB)";
            } else if (size >= 10 && size < 100) {
                sizeCategory = "(_10 KB – 100 KB)";
            } else if (size >= 100 && size < 1024) {
                sizeCategory = "(100 KB – __1 MB)";
            } else if (size >= 1024 && size < 10240) {
                sizeCategory = "(__1 MB – _10 MB)";
            } else if (size >= 10240 && size < 102400) {
                sizeCategory = "(_10 MB – 100 MB)";
            } else if (size >= 102400 && size < 1048576) {
                sizeCategory = "(100 MB – __1 GB)";
            } else {
                sizeCategory = "(          1+ GB)";
            }
        
            const ext = sizeCategory;
            return {ext, path}
        }
        const ext = size;

        return {ext, path}

    }
    
    let ext = "(      No Info)"
    return {ext, path}
}

function byName(item, currentPath, mode){
    let newItem = item.replace(/{[^}]*}/g, '').replace(';', '').trim()
    let cleanName = newItem;
    if (isNaN(newItem)){
        cleanName = newItem.substring(0, newItem.lastIndexOf('.'));
    }
    
    const path = `${currentPath}/${newItem}`;


    if (mode === '1'){
        const charCount = cleanName.length;
        const ext = charCount;
        return {ext, path};
    }
    else if (mode === '2'){
        const firstLetter = cleanName[0];
        const ext = firstLetter;
        return {ext, path};
    }
    else if (mode === '3'){
        const isPalindrome = cleanName === cleanName.split('').reverse().join('');
        const ext = isPalindrome;
        return {ext, path};
    }
    else if (mode === '4') {
        let n = parseInt(cleanName, 10);
        if (isNaN(n)){const ext = false; return { ext, path };}
        let isPrime = true;  // Inicializa como true
        // Números menores ou iguais a 1 não são primos
        if (n <= 1) {
            isPrime = false; 
        } else {
            // Verificação de divisibilidade a partir de 2
            for (let i = 2; i <= Math.sqrt(n); i++) {
                if (n % i === 0) {
                    isPrime = false;  // Se n for divisível por i, não é primo
                    break;  // Não precisa continuar verificando
                }
            }
        }
    
        const ext = isPrime;  // Usa o resultado da verificação
        return { ext, path }; // Retorna o resultado como parte do objeto
    }

    const ext = cleanName; // Extrair a extensão

    return {ext, path};
}

// Exemplo de uso
const input = [
      "Projetos/Pessoais/main/files/src",
      [
        "Readme.md;",
        "index2.html;",
        "language",
        [
          "7;",
          "12; ",
          "index.js;",
          "output.css;",
          "test.html;",
          "english",
          [
            "en.txt; {info-(0.050 MB)-info}",
            "en.xml; {info-(1.300 MB)-info}"
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

const organizedFiles = organizeFilesByPath(input);
const formattedOutput = formatOutput(organizedFiles);

// Imprimir a saída
console.log(formattedOutput.join('\n'));
