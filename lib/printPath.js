const fs = require('fs');
const path = require('path');

// Função para processar a estrutura e gerar diferentes formatos
function formatDirectoryStructure(structure, formatter) {
    switch (formatter) {
        case 0: return formatAsJSON(structure);
        case 1: return formatAsYAML(structure);
        case 2: return formatAsXML(structure);
        case 3: return formatAsTree(structure);
        case 4: return formatAsProtobuf(structure);
        case 5: return formatAsTOML(structure);
        case 6: return formatAsSExpression(structure);
        case 7: return formatAsThrift(structure);
        default: throw new Error("Formato inválido!");
    }
}

// Formatter 0: Formato JSON
function formatAsJSON(structure) {
    return JSON.stringify(parseToJsonFormat(structure), null, 2);
}

function parseToJsonFormat(structure) {
    const obj = {};
    for (let i = 0; i < structure.length; i++) {
        const item = structure[i];
        if (Array.isArray(item)) {
            const folderName = structure[i - 1];
            obj[folderName] = parseToJsonFormat(item);
        } else if (typeof item === 'string') {
            obj[item] = {};
        }
    }
    return obj;
}

// Formatter 1: Formato YAML sem duplicar pastas
function formatAsYAML(structure, depth = 0) {
    let yaml = '';
    const indent = '  '.repeat(depth);

    for (let i = 0; i < structure.length; i++) {
        const item = structure[i];

        // Verifica se é uma pasta
        if (Array.isArray(item)) {
            // Caso o item anterior não seja uma pasta
            if (i > 0 && typeof structure[i - 1] === 'string') {
                yaml += `${indent}${structure[i - 1]}:\n${formatAsYAML(item, depth + 1)}`;
            }
        } else if (typeof item === 'string') {
            // Se for um arquivo, apenas adiciona
            if (i === structure.length - 1 || !Array.isArray(structure[i + 1])) {
                yaml += `${indent}${item}\n`;
            }
        }
    }
    return yaml;
}


// Formatter 2: Formato XML
function formatAsXML(structure, depth = 0) {
    let xml = '';
    const indent = '  '.repeat(depth);
    for (let i = 0; i < structure.length; i++) {
        const item = structure[i];
        if (Array.isArray(item)) {
            if (i > 0 && typeof structure[i - 1] === 'string') {
                const folderName = structure[i - 1];
                xml += `${indent}<directory name="${folderName}">\n${formatAsXML(item, depth + 1)}${indent}</directory>\n`;
            }
        } else if (typeof item === 'string') {
            if (i === structure.length - 1 || !Array.isArray(structure[i + 1])) {
                xml += `${indent}<file name="${item}"/>\n`;
            }
        }
    }
    return xml;
}

// Formatter 3: Formato Tree (estrutura visual)
function formatAsTree(structure, depth = 0) {
    let tree = '';
    const indent = '│   '.repeat(depth);
    for (let i = 0; i < structure.length; i++) {
        const item = structure[i];
        if (Array.isArray(item)) {
            if (i > 0 && typeof structure[i - 1] === 'string') {
                const folderName = structure[i - 1];
                tree += `${indent}├── ${folderName}\n${formatAsTree(item, depth + 1)}`;
            }
        } else if (typeof item === 'string') {
            if (i === structure.length - 1 || !Array.isArray(structure[i + 1])) {
                tree += `${indent}├── ${item}\n`;
            }
        }
    }
    return tree;
}

// Formatter 4: Protocol Buffers (Protobuf)
function formatAsProtobuf(structure, rootName = "Project") {
    // Função auxiliar para converter a estrutura para o formato Protobuf
    function parseToProtobuf(structure, depth = 0) {
        let result = '';
        const indent = '  '.repeat(depth); // Adiciona indentação conforme a profundidade

        for (let i = 0; i < structure.length; i++) {
            const item = structure[i];

            if (Array.isArray(item)) {
                // Verifica se o nome da pasta existe e é uma string antes de capitalizar
                const folderName = typeof structure[i - 1] === 'string' ? structure[i - 1] : `Folder_${i}`;
                result += `${indent}message ${capitalize(folderName)} {\n`;
                result += parseToProtobuf(item, depth + 1); // Recursão para conteúdo da pasta
                result += `${indent}}\n`;
            } else if (typeof item === 'string') {
                // Se for um arquivo, trata como um campo no Protobuf
                result += `${indent}string ${formatFileName(item)} = ${i + 1};\n`;
            }
        }
        return result;
    }

    // Função auxiliar para capitalizar o nome das pastas no formato Protobuf
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    // Função auxiliar para formatar o nome dos arquivos
    function formatFileName(fileName) {
        return fileName.replace(/\./g, '_'); // Substitui '.' por '_' no nome dos arquivos
    }

    // Adiciona cabeçalho Protobuf e chama a função de parsing
    let protobufString = 'syntax = "proto3";\n\n';

    // Se a entrada começar diretamente com arquivos, trata como o root da mensagem
    protobufString += `message ${capitalize(rootName)} {\n`;
    protobufString += parseToProtobuf(structure, 1);
    protobufString += '}\n';

    return protobufString;
}

// Formatter 5: TOML (Tom's Obvious, Minimal Language)
function formatAsTOML(structure, rootName = "Project") {
    let tomlOutput = "";

    function parseToTOML(structure, parent = null) {
        let files = [];
        let result = "";

        for (let i = 0; i < structure.length; i++) {
            const item = structure[i];

            // Se for uma string, é um arquivo
            if (typeof item === 'string') {
                // Se não há um subarray logo após, é um arquivo direto
                if (i === structure.length - 1 || typeof structure[i + 1] !== 'object') {
                    if (parent) {
                        files.push(item);
                    } else {
                        if (typeof item === 'string') {
                            files.push(item);
                        }
                    }
                }
            }

            // Se for um array, é uma subpasta ou grupo de arquivos
            if (Array.isArray(item)) {
                const folderName = structure[i - 1];
                // Adiciona os arquivos da pasta corrente antes de processar a subpasta
                if (files.length > 0) {
                    result += `${parent ? `[${parent}]\n` : ''}files = [${files.map(f => `"${f}"`).join(", ")}]\n\n`;
                    files = [];  // Limpa a lista de arquivos para a próxima pasta
                }
                //result += `[${parent ? parent + '.' : ''}${folderName}]\n`;
                result += parseToTOML(item, `${parent ? parent + '.' : ''}${folderName}`);
            }
        }

        // Adiciona arquivos restantes no final da pasta atual
        if (files.length > 0) {
            result += `${parent ? `[${parent}]\n` : ''}files = [${files.map(f => `"${f}"`).join(", ")}]\n\n`;
        }

        return result;
    }

    // Se a primeira entrada for uma string, não há pasta root
    if (typeof structure[0] === 'string') {
        tomlOutput += parseToTOML(structure);
    } else {
        const rootFolder = structure[0]; // A primeira entrada é a pasta root
        tomlOutput += `[${rootFolder}]\n`;
        tomlOutput += parseToTOML(structure[1], rootFolder);
    }

    return tomlOutput;
}

// Formatter 6: S-expression (Symbolic Expressions)
function formatAsSExpression(structure, root = null) {
    let result = '';

    // Se houver uma raiz (nome da pasta principal), adiciona a raiz no formato S-expression
    if (root) {
        result += `(${root} `;
    }

    // Função auxiliar recursiva para processar a estrutura
    function parseToSExpression(struct) {
        let sExpr = '';

        for (let i = 0; i < struct.length; i++) {
            const item = struct[i];
            
            if (Array.isArray(item)) {
                // Processa subdiretórios recursivamente
                sExpr += `${parseToSExpression(item)}`;
            } else if (typeof struct[i + 1] === 'object') {
                // Se o próximo item for um array, este item é uma pasta
                let folderName = item;
                let folderItems = []; // Coleta os itens da pasta

                // Itera e coleta todos os arquivos da pasta
                for (let j = i + 1; j < struct.length && Array.isArray(struct[j]); j++) {
                    folderItems.push(parseToSExpression(struct[j]));
                    i = j; // Avança o índice para o próximo item
                }

                // Concatena os itens da pasta de uma só vez
                sExpr += `(${folderName} (${folderItems.join(' ')}))`;
            } else {
                // Caso seja um arquivo (simples string)
                sExpr += `${item}`;
            }

            // Adiciona um espaço entre os itens, exceto no final
            if (i < struct.length - 1 && !Array.isArray(struct[i + 1])) {
                sExpr += ' ';
            }
        }

        return sExpr.trim();
    }

    // Processa a estrutura e fecha a raiz se houver
    result += parseToSExpression(structure);

    if (root) {
        result += ')'; // Fecha o parêntese da raiz
    }

    return result.trim();
}

// Formatter 7: Thrift
function formatAsThrift(structure, root = null) {
    let result = '';

    // Função auxiliar para gerar o Thrift a partir da estrutura
    function parseToThrift(struct, name = "Root", indent = 0) {
        let thrift = '';
        const indentStr = '  '.repeat(indent); // Define o nível de indentação

        // Verifica se é uma pasta
        thrift += `${indentStr}struct ${name} {\n`;
        let fieldIndex = 1;

        struct.forEach((item, index) => {
            if (Array.isArray(item)) {
                // Trata subdiretórios (pastas dentro de pastas)
                thrift += parseToThrift(item, struct[index - 1], indent + 1);
            } else if (typeof struct[index + 1] === 'object') {
                // Quando o próximo item é um array, o item atual é tratado como uma pasta
                thrift += `${indentStr}  ${fieldIndex}: folder ${item} {\n`;
                fieldIndex++;
            } else {
                // Caso seja um arquivo, adiciona como string no Thrift
                thrift += `${indentStr}  ${fieldIndex}: file ${item};\n`;
                fieldIndex++;
            }
        });

        thrift += `${indentStr}}\n`;
        return thrift;
    }

    // Adiciona a raiz se fornecida
    result += parseToThrift(structure, root ? root : "Root");

    return result.trim();
}

function formatRootPath(input, formatter) {
    // Verifica se o primeiro elemento é uma string, ou seja, a pasta root
    if (typeof input[0] === 'string' && input[0].includes('/')) {

        switch(formatter){
            case 5:
                // Substitui todas as ocorrências de "/" por "."
                input[0] = input[0].replace(/\//g, '.');
                break;
        }
    }
    return input;
}


// Função de saída com base no parâmetro "print"
function handleOutput(content, formatter, printOption) {
    const formattedOutput = formatDirectoryStructure(content, formatter);

    switch (printOption) {
        case 0:
            saveToFile(formattedOutput, formatter);
            return formattedOutput;
        case 1:
            console.log(formattedOutput);
            return formattedOutput;
        case 2:
            console.log(formattedOutput);
            saveToFile(formattedOutput, formatter);
            return formattedOutput;
        default:
            throw new Error("Parâmetro de impressão inválido!");
    }
}

// Função para salvar a saída no arquivo correto baseado no SO
function saveToFile(content, formatter) {
    const os = require('os');
    const homeDir = os.homedir();
    const saveDir = path.join(homeDir, 'path', 'data');

    if (!fs.existsSync(saveDir)) {
        fs.mkdirSync(saveDir, { recursive: true });
    }

    const fileName = getFileNameByFormatter(formatter);
    const filePath = path.join(saveDir, fileName);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Arquivo salvo em: ${filePath}`);
}

// Determina o nome do arquivo com base no formato escolhido
function getFileNameByFormatter(formatter) {
    switch (formatter) {
        case 0: return 'directory_structure.json';
        case 1: return 'directory_structure.yaml';
        case 2: return 'directory_structure.xml';
        case 3: return 'directory_structure.txt';
        case 4: return 'directory_structure.proto';
        case 5: return 'directory_structure.toml';
        case 6: return 'directory_structure.toml';
        case 7: return 'directory_structure.toml';
        default: throw new Error("Formato inválido!");
    }
}

// Exemplo de entrada
const fileSystemArray = ["src",["Readme.md","index2.html","language",["es-1.json","index.html","index.js","output.css","test.html","english",["en.txt","en.xml"],"portuguese",["pt.txt"]],"text",["text.txt"]]];

const fileOrgExt = ["md", ["/src/Readme.md"]]

// Chama a função handleOutput com diferentes opções
handleOutput(fileSystemArray, 7, 1);  // Exemplo com JSON, apenas printa
handleOutput(fileOrgExt, 7, 1);  // Exemplo com JSON, apenas printa

function printPath(path){
    return handleOutput(path)
}

module.exports = printPath;