const fs = require('fs');
const path = require('path');
const os = require('os');
const filterType = require('./filterType');
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
            return fileContent == "" ? '' : `; {text-(${fileContent})-text}`;
        }

        // First N Chars
        if (nChars > 0 && searchWords.length === 0) {
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

function getFullInfo(fullPath, perm, size, errorReport, report) {
    const stat = fs.statSync(fullPath);
    let info = [];

    if (stat.isFile()) {

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

function orgType(item, type, words) {
    // Remove colchetes dos parâmetros e separa os elementos
    const typesArray = type.replace(/\[|\]/g, '').split(',').map(t => t.trim());
    const wordsArray = words.match(/\[[^\]]*\]/g) ? words.match(/\[[^\]]*\]/g).map(group => group.replace(/\[|\]/g, '').split(',').map(word => word.trim())) : [words.split(',').map(word => word.trim())];
  
    // Caso todos os types tenham correspondência em words
    if (typesArray.length === wordsArray.length) {
      for (let i = 0; i < typesArray.length; i++) {
        const currentType = typesArray[i];
        const currentWords = wordsArray[i];

        item = filterType(currentType, item, currentWords);
        console.log(`Ação de type ${currentType} com palavras: ${currentWords.join(', ')}`);
      }
      return item;
    } else if (typesArray.length < wordsArray.length) {
      // Se houver mais grupos de palavras do que types
      for (let i = 0; i < typesArray.length - 1; i++) {
        const currentType = typesArray[i];
        const currentWords = wordsArray[i];

        item = filterType(currentType, item, currentWords);
        console.log(`Ação de type ${currentType} com palavras: ${currentWords.join(', ')}`);

      }
      const lastType = typesArray[typesArray.length - 1];
      const remainingWords = wordsArray.slice(typesArray.length - 1).flat();

      item = filterType(lastType, item, remainingWords);
      console.log(`Ação de type ${lastType} com palavras: ${remainingWords.join(', ')}`);
      return item;
    } else {
      // Se houver mais types do que grupos de palavras
      for (let i = 0; i < wordsArray.length; i++) {
        const currentType = typesArray[i];
        const currentWords = wordsArray[i];

        item = filterType(currentType, item, currentWords);
        console.log(`Ação de type ${currentType} com palavras: ${currentWords.join(', ')}`);
      }
      const lastType = typesArray[typesArray.length - 1];
      const remainingWords = wordsArray.flat();

      item = filterType(lastType, item, remainingWords);
      console.log(`Ação de type ${lastType} com palavras: ${remainingWords.join(', ')}`);
      return item;
    }
}

function processDirectory(dirPath, progressCounter, perm, size, textFile, errorReport = [], report, filterFolder, filterFile, type) {
    const result = [];
    try {
    const items = fs.readdirSync(dirPath);
    
    const directories = [];

    const filterListFolder = filterFolder.split(',').map(f => f.trim());
    const filterListFile = filterFile.split(',').map(f => f.trim());

    items.forEach(item => {
        progressCounter.count++;
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isFile()) {

            item = orgType(item, type, filterFile)
            /*
            type.split(',').forEach(t => {
                item = filterType(t, item, filterListFile);
                return item;
            });
            */
            if (item) {
                const fileInfo = getFullInfo(fullPath, perm, size, errorReport, report);
                const filePreview = getFirstNCharacters(fullPath, textFile, errorReport);
            
                result.push(`${item}${fileInfo}${filePreview}`);
            }
            
        } else if (stat.isDirectory()) {

            item = orgType(item, type, filterFolder)
            /*
            type.split(',').forEach(t => {
                item = filterType(t, item, filterListFolder);
                return item;
            });
            */

            if (item) {
                directories.push(`${item}`);
            }
        }
        process.stdout.write(`Process Items: ${progressCounter.count}\r`);
    });

    directories.forEach(directory => {
        const folderName = directory;
        const dirPathWithInfo = `${folderName}${getFullInfo(path.join(dirPath, folderName), perm, size, errorReport)}`;
        result.push(dirPathWithInfo, processDirectory(path.join(dirPath, directory), progressCounter, perm, size, textFile, errorReport, report, filterFolder, filterFile, type));
    });

    } catch (err) {
        if (report > 1) {
            errorReport.push({ path: fullPath, error: `${err.code || 'ERROR'}: ${err.message}` });
            info.push(`${err.code || 'ERROR'}: ${err.message}`);
        }
    }
    
    return result;
}

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
            // Full Root (without user)
            const userHomeDir = os.homedir();
            return [(baseDir.slice(userHomeDir.length + 1)), result];
        case 3:
            // Full Root (with user)
            return [baseDir, result];
        default:
            throw new Error("Invalid Formatt. Use 0, 1, 2 or 3.");
    }
}


/**
 * 
 * @param {String} dirPath 
 * @param {Number} fps 
 * @param {String} textFile 
 * @param {String} filterFolder 
 * @param {String} filterFile 
 * @param {Number} report 
 * @returns {Object[]}
 */
function main(dirPath, fps = '2,0,3', textFile = 0, type = '', filterFile = '', filterFolder = '', report = 0) {
    const progressCounter = { count: 0 };
    const errorReport = [];
    [fps, type] = [String(fps), String(type)];
    let [formatter, perm, size] = fps.replace(/[\[\]]/g, '').split(',').map(Number);
    console.log(formatter)
    report = Number((isNaN(report) ? report = 0 : report));
    filterFolder = (typeof filterFolder === 'string' ? filterFolder : '')
    filterFile = (typeof filterFile === 'string' ? filterFile : '')
    
    const result = processDirectory(dirPath, progressCounter, perm, size, textFile, errorReport, report, filterFolder, filterFile, type);
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

/**
 * @function readPath
 * @param {String} result 
 * @param  {Array} param 
 * @returns {Object[]} result
 */
function readPath(result, ...param){
    
    if (result.length != 0){
        for (let i = 0; i < (result.length); i++) {
            switch (param[0]) {
                case '/f':
                    result[i] = main(result[i], 0, 0, 5);
                    break;
                case '/b':
                    result[i] = main(result[i], '2,0,3', '*', ...param.slice(1));
                    break;
                case '/dev':
                    result[i] = main(result[i], 0, 0, 'dn*', ".git,packages,public,.next,.gitignore,.github,node_modules,.eslintrc.js,.dockerignore,DockerfileApi,DockerfileWeb", ".git,packages,public,.next,.gitignore,.github,node_modules,.eslintrc.js,.dockerignore,DockerfileApi,DockerfileWeb");
                    break;
                case '/test':
                    result[i] = main(result[i], '2,0,3', '10', 'di2', ".json,json", "");
                    break;
                case '/':
                    result[i] = main(result[i], ...param.slice(1));
                    break;
                case (undefined || ""):
                    result[i] = main(result[i]);
                default:
                    result[i];
                    break;
            }   
        }
    } else {
        obs = 'Path not exists'
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

