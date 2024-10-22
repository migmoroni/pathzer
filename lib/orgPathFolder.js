function processEntries(entries, parent = []) {
    const result = [];
    const files = [];
    const folders = [];

    for (let i = 0; i < entries.length; i++) {
        const item = entries[i];

        if (Array.isArray(entries[i + 1])) {
            // Se o próximo item for um array, este item é uma pasta
            folders.push([item, entries[i + 1]]);
            i++; // Pula o conteúdo da pasta
        } else if (!Array.isArray(item)) {
            // Se for um arquivo, apenas empilha no array de arquivos
            files.push(item);
        }
    }

    // Agrupar arquivos pela extensão
    const fileGroups = {};
    files.forEach(file => {
        const extension = path.extname(file);
        if (!fileGroups[extension]) {
            fileGroups[extension] = [];
        }
        fileGroups[extension].push(file);
    });

    // Adiciona os arquivos agrupados no resultado final
    for (const ext in fileGroups) {
        result.push([...parent, ...fileGroups[ext]]);
    }

    // Agora processa as pastas
    folders.forEach(([folderName, folderContent]) => {
        result.push(...processEntries(folderContent, [...parent, folderName]));
    });

    return result;
}

function processEntries2(entries, parent = []) {
    const result = [];
    const files = [];
    const folders = [];

    for (let i = 0; i < entries.length; i++) {
        const item = entries[i];

        if (Array.isArray(entries[i + 1])) {
            // Se o próximo item for um array, este item é uma pasta
            folders.push([item, entries[i + 1]]);
            i++; // Pula o conteúdo da pasta
        } else if (!Array.isArray(item)) {
            // Se for um arquivo, apenas empilha no array de arquivos
            files.push(item);
        }
    }

    // Agrupar arquivos pela extensão
    const fileGroups = {};
    files.forEach(file => {
        const extension = path.extname(file);
        if (!fileGroups[extension]) {
            fileGroups[extension] = [];
        }
        fileGroups[extension].push(file);
    });

    // Adiciona os arquivos agrupados no resultado final
    for (const ext in fileGroups) {
        result.push(...parent, [...fileGroups[ext]]);
    }

    // Agora processa as pastas
    folders.forEach(([folderName, folderContent]) => {
        result.push(...processEntries2(folderContent, [...parent, folderName]));
    });

    return result;
}

function processEntries3(entries, parent = []) {
    const result = [];
    const files = [];
    const folders = [];

    for (let i = 0; i < entries.length; i++) {
        const item = entries[i];

        if (Array.isArray(entries[i + 1])) {
            // Se o próximo item for um array, este item é uma pasta
            folders.push([item, entries[i + 1]]);
            i++; // Pula o conteúdo da pasta
        } else if (!Array.isArray(item)) {
            // Se for um arquivo, apenas empilha no array de arquivos
            files.push(item);
        }
    }

    // Agrupar arquivos pela extensão
    const fileGroups = {};
    files.forEach(file => {
        const extension = path.extname(file);
        if (!fileGroups[extension]) {
            fileGroups[extension] = [];
        }
        fileGroups[extension].push(file);
    });

    // Adiciona os arquivos agrupados no resultado final
    for (const ext in fileGroups) {
        result.push(...parent, [...fileGroups[ext]]);
    }

    // Agora processa as pastas
    folders.forEach(([folderName, folderContent]) => {
        result.push([...processEntries3(folderContent, [...parent, folderName])]);
    });

    return result;
}

// Módulo path é usado para obter extensões
const path = require('path');

// Exemplo de entrada
const fileSystemArray = ["src",["Readme.md","index2.html","language",["es-1.json","index.html","index.js","output.css","test.html","english",["en.txt","en.xml"],"portuguese",["pt.txt"]],"text",["text.txt"]]];

// Chama a função para processar a entrada
const structuredResult = processEntries3(fileSystemArray);


// Exibe o resultado
console.log(JSON.stringify(structuredResult, null, 0));
