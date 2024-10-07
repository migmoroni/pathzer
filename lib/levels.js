const { version, help, rootPath,  } = require('./options');
var found = false;
let obs = [];
let result = [];

// Level 1 - System
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

// Level 2 - Process Path
function executeLevel2(result, option, ...param) {
    switch (option) {
        case '?':
            [result, obs] = rootPath(obs, result, ...param);
            found = true;
            break;
        case 'rp':
            result = readPath(result, ...param);
            found = true;
            break;
        case 'pp':
            result = printPath(result, ...param);
            found = true;
            break;
        case 'wp':
            result = writePath(result, ...param);
            found = true;
            break;
        case 'fp':
            result = filterPath(result, ...param);
            found = true;
            break;
        case 'sp':
            result = searchPath(result, ...param);
            found = true;
            break;
        case 'op':
            result = orgPath(result, ...param);
            found = true;
            break;
        default:
            (hierarchical == true) ? result = null : result;
    }
    return result;
}

// Level 3 - Analyser Path
function executeLevel3(result, option, ...param) {
    switch (option) {
        case 'imp':
            result = imagePath(result, ...param);
            found = true;
            break;
        case 'dop':
            result = docPath(result, ...param);
            found = true;
            break;
        case 'mup':
            result = musicPath(result, ...param);
            found = true;
            break;
        case 'vip':
            result = videoPath(result, ...param);
            found = true;
            break;
        case 'prp':
            result = programPath(result, ...param);
            found = true;
            break;
        default:
            (hierarchical == true) ? result = null : result;
    }
    return result;
}

// Level 4 - Work Path
function executeLevel4(result, option, ...param) {
    switch (option) {
        case 'rp':
            result = readPath(result, ...param);
            found = true;
            break;
        default:
            (hierarchical == true) ? result = null : result;
    }
    return result;
}

function level3OptionA(...param) {
    console.log(`Level 3, Option A: Executing with parameter ${param}`);
}

function level3OptionB(...param) {
    console.log(`Level 3, Option B: Executing with parameter ${param}`);
}

function level3OptionC(...param) {
    console.log(`Level 3, Option C: Executing with parameter ${param}`);
}

// Control Levels
function levels(level, option, ...param) {

    if (param == ''){
        param = [""]
    }

    if (hierarchical) {
        if (levelFunctions[level]) {
            result = levelFunctions[level](result, option, ...param);
        } else {
            console.log(`Option ${option} not recognized in level ${level}`);
        }
        /*
        if (level == MAX_LEVELS){
            console.log(JSON.stringify(result, null, 2));
        }
        */
    } else {
        result = uniqueLevel(result, option, ...param);
    }
    
    return {
        level: level,
        option: option,
        param: param,
        result: result,
        obs: obs
    };
}

// Level Unique
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

   //if (result[])

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
