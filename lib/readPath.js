const fs = require('fs');
const path = require('path');
const os = require('os');
let obs = []

function getFirstNCharacters(filePath, textFile, errorReport) {
    let nChars = 0;
    let searchWords = [];
    let captureWholeFile = false;
    try {
    if (typeof textFile === 'string') {
        const parts = textFile.split(',');

        // "*"
        if (textFile.trim() === '*') {
            captureWholeFile = true;
        // "word1,wordN"
        } else if (isNaN(parseInt(parts[0]))) {
            searchWords = parts.filter(Boolean);
        } else {
        // "12,word"
            nChars = parseInt(parts[0], 10);
            searchWords = parts.slice(1).filter(Boolean);
        }
    // "12"
    } else if (typeof textFile === 'number') {
        nChars = textFile;
    }

    
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        // All Chars
        if (captureWholeFile) {
            //return `; {t(${fileContent})t}`;

            return fileContent == "" ? '' : `; {text-(${fileContent})-text}`;
        }

        // First N Chars
        if (nChars > 0 && searchWords.length === 0) {
            //return `; {t(${fileContent.slice(0, nChars)})t}`;
            return fileContent.slice(0, nChars) == "" ? '' : `; {text-(${fileContent.slice(0, nChars)})-text}`;
        }

        // Search Words
        if (searchWords.length > 0) {
            const lines = fileContent.split('\n');
            const result = [];
            let nWords = 1;
            searchWords.forEach((word) => {
                lines.forEach(line => {
                    if (line.includes(word)) {
                        const startIndex = line.indexOf(word);
                        if (nChars > 0) {
                            const capturedText = line.slice(startIndex, startIndex + word.length + nChars);
                            result.push(`{wc${nWords}(${capturedText})wc${nWords}}`);
                            nWords++;
                        } else {
                            result.push(`{w${nWords}(${line.slice(startIndex, startIndex + word.length)})w${nWords}}`);
                            nWords++;
                        }
                    }
                });
                result.push('');
            });

            return result.join('') == "" ? '' : `; {text-(${result.join('')})-text}`;
        }

        return '';

    } catch (err) {
        errorReport.push({ path: filePath, error: `${err.code || 'ERROR'}: ${err.message}` });
        return `${err.code || 'ERROR'}: ${err.message}`;
    }
}

function getFileInfo(fullPath, perm, size, errorReport, report) {
    const stat = fs.statSync(fullPath);
    let info = [];

    // Verifica se o caminho é um arquivo e não uma pasta
    if (stat.isFile()) {
        // Verifica as permissões se perm for 2
        if (perm > 0) {
            try {
                const isReadable = fs.accessSync(fullPath, fs.constants.R_OK) === undefined;
                const isWritable = fs.accessSync(fullPath, fs.constants.W_OK) === undefined;
                info.push(`${isReadable ? 'r' : '-'}/${isWritable ? 'w' : '-'}`);
            } catch (err) {
                if (report > 1) {
                    errorReport.push({ path: fullPath, error: `${err.code || 'ERROR'}: ${err.message}` });
                    info.push(`${err.code || 'ERROR'}: ${err.message}`);
                }
            }
        }

        // Verifica o tamanho do arquivo se o tamanho foi solicitado
        if (size > 0) {
            let fileSize = stat.size;
            if (size === 2) {
                fileSize = (fileSize / 1024).toFixed(3) + ' KB';
            } else if (size === 3) {
                fileSize = (fileSize / (1024 * 1024)).toFixed(3) + ' MB';
            } else if (size === 4) {
                fileSize = (fileSize / (1024 * 1024)).toFixed(6) + ' MB';
            } else if (size === 5) {
                let fileS = fileSize;
                if (fileS > 1073741824) {
                    fileSize = (fileSize / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
                } else if (fileS > 1048576) {
                    fileSize = (fileSize / (1024 * 1024)).toFixed(1) + ' MB';
                } else if (fileS > 1024) {
                    fileSize = (fileSize / 1024).toFixed(1) + ' KB';
                } else {
                    fileSize = (fileSize).toFixed(0) + ' bytes';
                }
            } else {
                fileSize = fileSize + ' bytes';
            }
            info.push(fileSize);
        }
    }

    return info.length > 0 ? `; {info-(${info.join(', ')})-info}` : '';
}

// Função principal para processar o diretório e seus arquivos
function processDirectory(dirPath, progressCounter, perm, size, textFile, errorReport = [], report, filterFolder) {
    const result = [];
    try {
    const items = fs.readdirSync(dirPath);
    
    const directories = [];
    // Separa os filtros em um array
    const filterList = filterFolder.split(',').map(f => f.trim().toLowerCase());

    // Primeiro processa todos os arquivos
    items.forEach(item => {
        progressCounter.count++;
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isFile()) {
            const fileInfo = getFileInfo(fullPath, perm, size, errorReport, report);
            const filePreview = getFirstNCharacters(fullPath, textFile, errorReport);
         
            result.push(`${item}${fileInfo}${filePreview}`);
          
        } else if (stat.isDirectory()) {
            // Verifica se o diretório está no filtro
            if (!filterList.includes(item.toLowerCase())) {
                // Se não estiver no filtro, armazena para processar depois
                directories.push(item);
            } else {
                console.log(`Skipping folder: ${item}`);
            }
        }
        process.stdout.write(`\rProcess Files: ${progressCounter.count}`);
    });

    // Agora processa as pastas (diretórios) após os arquivos
    directories.forEach(directory => {
        const folderName = directory; // Nome da pasta sem extensão
        const dirPathWithInfo = `${folderName}${getFileInfo(path.join(dirPath, folderName), perm, size, errorReport)}`;
        result.push(dirPathWithInfo, processDirectory(path.join(dirPath, directory), progressCounter, perm, size, textFile, errorReport, report, filterFolder));
    });
    } catch (err) {
        if (report > 1) {
            errorReport.push({ path: fullPath, error: `${err.code || 'ERROR'}: ${err.message}` });
            info.push(`${err.code || 'ERROR'}: ${err.message}`);
        }
    }
    
    return result;
}

// Função para adicionar o root de acordo com o valor de formatter
function formatResult(baseDir, formatter, result) {
    switch (formatter) {
        case 0:
            // No Root
            return result;
        case 1:
            // Folder Root
            const rootName = path.basename(baseDir);
            return [rootName, result];
        case 2:
            // Full Root
            const userHomeDir = os.homedir();
            return [(baseDir.slice(userHomeDir.length + 1)), result];
        default:
            throw new Error("Formatter inválido. Use 0, 1 ou 2.");
    }
}

// Função que inicia o processo a partir de um caminho fornecido
/**
 * 
 * @param {String} dirPath 
 * @param {Number} formatter 
 * @param {Number} perm 
 * @param {Number} size 
 * @param {String} textFile 
 * @param {String} filterFolder 
 * @param {Number} report 
 * @returns {Object[]}
 */
function main(dirPath, formatter = 0, perm = 0, size = 0, textFile = '', filterFolder = '', report = 0) {
    const progressCounter = { count: 0 };
    const errorReport = [];
    formatter = Number(formatter);
    perm = Number(perm);
    size = Number(size);
    report = Number(report);

    const result = processDirectory(dirPath, progressCounter, perm, size, textFile, errorReport, report, filterFolder);
    console.log("\r")

    if (report > 0){
        
        if (report > 1) {
            console.log("\nError Relatory:");
            errorReport.forEach(err => {
                console.log(`Path error: ${err.path} -> ${err.error}`);
            });
            return errorReport == 0 ? console.log("No Errors") : "";
        }
        return console.log(JSON.stringify(formatResult(dirPath, formatter, result), null, 2));
    }
    return formatResult(dirPath, formatter, result);
}

/*
"rp=f" => "2,1,5,*,0"
"rp=b" => "2,0,0,0,0"
"rp=c,"
*/

/**
 * @function readPath
 * @param {String} result 
 * @param  {Array} param 
 * @returns {Object[]} result
 */
function readPath(result, ...param){
    for (let i = 0; i < (result.length); i++) {
        switch (param[0]) {
            case 'f':
                result[i] = main(result[i], 0, 0, 5);
                break;
            case 'b':
                result[i] = main(result[i], 2);
                break;
            case 'p':
                result[i] = main(result[i], 2, 0, 5, 0, '.git');
                break;
            case 'c':
                result[i] = main(result[i], ...param.slice(1));
                break;
            default:
                result[i];
        }
    }
    return [result, obs];
}
/*
// Example
const dirPath = '/home/miguel/Projetos/Externos/GameGuild/website/services/web/src';
const formatter = 2;
const perm = 0;
const size = 5;
const textFile = 0;
const report = 1;

readPath(dirPath, formatter, perm, size, textFile, report);

//console.log(JSON.stringify(fileSystemStructure, null, 2));
*/
module.exports = readPath;

