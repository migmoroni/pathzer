const { version, help } = require('./options');
var found = false;


// Level 1
function executeLevel1(result, option, ...param) {
    switch (option) {
        case '-i':
            case '-info':
                help();
                result = 'help'
                found = true;
                break;
        case '-v':
            case '-version':
                version();
                result = 'version'
                found = true;
                break;
        case '?':
            result = level1OptionA(...param);
            //result = 'help'
            found = true;
            break;
        case 'b':
            result = level1OptionB(...param);
            result = 'help'
            found = true;
            break;
        case 'c':
            result = level1OptionC(...param);
            //result = 'help'
            found = true;
            break;
        default:
            console.log('Invalid level 1 option.');
    }
    return result;
}

function level1OptionA(...param) {
    console.log(`Level 1, Option A: Executing with parameter ${param}`);
}

function level1OptionB(...param) {
    console.log(`Level 1, Option B: Executing with parameter ${param}`);
}

function level1OptionC(...param) {
    console.log(`Level 1, Option C: Executing with parameter ${param}`);
}

// Level 2
function executeLevel2(result, option, ...param) {
    switch (option) {
        case 'a':
            level2OptionA(...param);
            break;
        case 'b':
            level2OptionB(...param);
            break;
        case 'c':
            level2OptionC(...param);
            break;
        default:
            console.log('Invalid Level 2 option.');
    }
    return result = 2;
}

function level2OptionA(...param) {
    console.log(`Level 2, Option A: Executing with parameter ${param}`);
}

function level2OptionB(...param) {
    console.log(`Level 2, Option B: Executing with parameter ${param}`);
}

function level2OptionC(...param) {
    console.log(`Level 2, Option C: Executing with parameter ${param}`);
}

// Level 3
function executeLevel3(result, option, ...param) {
    switch (option) {
        case 'a':
            level3OptionA(...param);
            break;
        case 'b':
            level3OptionB(...param);
            break;
        case 'c':
            level3OptionC(...param);
            break;
        default:
            console.log('Invalid Level 3 option.');
    }
    return result = 3;
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
function levels(result, level, option, ...param) {
    //console.log(result)

    if (hierarchical) {
        if (levelFunctions[level]) {
            result = levelFunctions[level](result, option, ...param);
        } else {
            console.log(`Level ${level} not recognized.`);
        }

        if (level == MAX_LEVELS){
            console.log(JSON.stringify(result, null, 2));
        }
        
    } else {
        result = uniqueLevel(level, result, option, ...param);
    }
    
    return {
        hierarchical: hierarchical,
        level: level,
        option: option,
        param: param,
        result: result
    };
}

// Level Unique
function uniqueLevel(glevel, result, option, ...param){
    let level = 1;

    while (!found) {
        if (levelFunctions[level]) {
            result = levelFunctions[level](result, option, ...param);
            break;
        } else {
            console.log(`Option ${option} not recognized.`);
            break;
        }

        level++;
    }

    return {
        hierarchical: hierarchical,
        level: level,
        option: option,
        param: param,
        result: result
    };
}

// Object that maps levels to their respective functions
const levelFunctions = {
    1: executeLevel1,
    2: executeLevel2,
    3: executeLevel3
    // Add more levels here as needed
};

const MAX_LEVELS = 3;
const hierarchical = false;

module.exports = {
    MAX_LEVELS,
    levels
};
