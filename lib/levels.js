const { version, help } = require('./options');
const rootPath = require('./rootPath');
const readPath = require('./readPath');
const modelPath = require('./modelPath');

var found = false;
let obs = [];
//let result = [];


/**
 * @function executeLevel1
 * @description
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
            //result = 'help';
            found = true;
            break;
        case '-v':
            case '-version':
            obs = version();
            //result = 'version';
            found = true;
            break;
        default:
            (hierarchical == true) ? result = null : result;
    }
    return result;
}

/**
 * @function executeLevel2
 * @description
 * @param {*} result 
 * @param {*} option 
 * @param  {...any} param 
 * @returns {Array<String|null>} result
 */

function executeLevel2(result, option, ...param) {
    switch (option) {
        // Read root and validate path
        case '?':
            [result, obs] = rootPath(result, ...param);
            found = true;
            break;
        // Read the path from root
        case 'rp':
            [result, obs] = readPath(result, ...param);
            found = true;
            break;
        // Search for path items
        case 'sp':
            [result] = searchPath(result, ...param);
            found = true;
            break;
        // Filter for path itens
        case 'fp':
            [result] = filterPath(result, ...param);
            found = true;
            break; 
        // In this structure, modify order the path
        case 'op':
            [result] = orgPath(result, ...param);
            found = true;
            break;
        // ReWrite Path in new structures
        case 'mp':
            [result, obs] = modelPath(result, ...param);
            found = true;
            break;
        // Write for file
        case 'pp':
            [result] = printPath(result, ...param);
            found = true;
            break;
        // Write in itens the path
        case 'wp':
            [result] = writePath(result, ...param);
            found = true;
            break;
        default:
            (hierarchical == true) ? result = null : result;
    }
    return result;
}

/**
 * @function executeLevel3
 * @description
 * @param {*} result 
 * @param {*} option 
 * @param  {...any} param 
 * @returns {Array<String|null>} result
 */

function executeLevel3(result, option, ...param) {
    switch (option) {
        case 'reap':
            result = reactPath(result, ...param);
            found = true;
            break;
        case 'vuep':
            result = vuePath(result, ...param);
            found = true;
            break;
        case 'angp':
            result = angularPath(result, ...param);
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
    
    return {
        level: level,
        option: option,
        param: param,
        result: result,
        obs: obs
    };
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
    MAX_LEVELS,
    levels
};
