const { version, help } = require('./options');
const rootImport = require('./rootImport');
const importPath = require('./importPath');
const importFile = require('./importFile');
const filterTree = require('./filterTree');
const exportTree = require('./exportTree');

var found = false;
let obs = [];
//let result = [];


/**
 * @function executeLevel1
 * @description System operations
 * @param {*} result 
 * @param {*} option 
 * @param  {...any} param 
 * @returns {Array<String|null>} result
 */

function executeLevel1(result, option, ...param) {
    switch (option) {
        case '-i':
            case '-info':
            obs = help();
            found = true;
            break;
        case '-v':
            case '-version':
            obs = version();
            found = true;
            break;
        default:
            (hierarchical == true) ? result = null : result;
    }
    return result;
}

/**
 * @function executeLevel2
 * @description Path Manipulation
 * @param {*} result 
 * @param {*} option 
 * @param  {...any} param 
 * @returns {Array<String|null>} result
 */

function executeLevel2(result, option, ...param) {
    switch (option) {
        // Read root and validate path
        case '?':
            [result, obs] = rootImport(result, ...param);
            found = true;
            break;
        // Read the path from root
        case 'ip':
            [result, obs] = importPath(result, ...param);
            found = true;
            break;
        // Read the file from root
        case 'if':
            [result, obs] = importFile(result, ...param);
            found = true;
            break;
        // Search for path items
        case 'st':
            [result, obs] = searchTree(result, ...param);
            found = true;
            break;
        // Filter for path itens
        case 'ft':
            [result, obs] = filterTree(result, ...param);
            found = true;
            break; 
        // In this structure, modify order the path
        case 'ot':
            [result, obs] = orgTree(result, ...param);
            found = true;
            break;
        // Write in itens the path
        case 'wp':
            [result, obs] = writeTree(result, ...param);
            found = true;
            break;
        // Print Tree in HTML
        case 'pt':
            [result, obs] = printTree(result, ...param);
            found = true;
            break;
        // ReWrite Path in new structures
        case 'ep':
            [result, obs] = exportTree(result, ...param);
            found = true;
            break;
        
        default:
            (hierarchical == true) ? result = null : result;
    }
    return result;
}

/**
 * @function executeLevel3
 * @description Path Analyser
 * @param {*} result 
 * @param {*} option 
 * @param  {...any} param 
 * @returns {Array<String|null>} result
 */

function executeLevel3(result, option, ...param) {
    switch (option) {
        case 'reactp':
            result = reactPath(result, ...param);
            found = true;
            break;
        case 'filep':
            result = filePath(result, ...param);
            found = true;
            break;
        default:
            (hierarchical == true) ? result = null : result;
    }
    return result;
}

/**
 * @function levels
 * @description Control the execution
 * @param {Number} level 
 * @param {String} option 
 * @param  {...String} param 
 * @returns {Object[]} [level, option, param, result, obs]
 */

function levels(result, level, option, ...param) {

    const log = true;

    if (param == ''){
        param = [""]
    }

    if (hierarchical) {
        if (levelFunctions[level]) {
            [result] = levelFunctions[level](result, option, ...param);
        } else {
            console.log(`Option ${option} not recognized in level ${level}`);
        }
        /*
        if (level == MAX_LEVELS){
            console.log(JSON.stringify(result, null, 2));
        }
        */
    } else {
        [result] = uniqueLevel(result, option, ...param);
    }

    if (log == false){
        return result;
    } else {
        return {
            level: level,
            option: option,
            param: param,
            result: result,
            obs: obs
        };
    }
}

/**
 * @function uniqueLevel
 * @description 
 * @param {*} result 
 * @param {*} option 
 * @param  {...any} param 
 * @returns {Array<String|null>} result
 */

function uniqueLevel(result, option, ...param){
    let level = 0;
    found = false;

    while (!found) {
        level++;
        if (levelFunctions[level]) {
            result = levelFunctions[level](result, option, ...param);
        } else {
            console.log(`Option ${option} not recognized in all ${level - 1} levels`);
            result = null;
            break
        }
    }

    return result;
}

const levelFunctions = {
    1: executeLevel1,
    2: executeLevel2,
    3: executeLevel3
};

const MAX_LEVELS = 5;
const hierarchical = false;

module.exports = {
    levels,
    MAX_LEVELS
    
};
