function version() {
    return 'Version 1.0.0';
}

function help() {
    return `
    Usage: fastcli [levels]

    Process levels hierarchically and pass options and parameters either via CLI or function call.

    Levels:
    A hierarchical input structure where each level is divided by spaces, commas, or equals signs. 
    Levels are defined by options and parameters:

    Options:

    -h, --help          Display this help message
    -v, --version       Display the version number of the program
    rp                  Read Path
    wp                  Write Path
    pp                  Print Path
    op                  Organize Path
    ap                  Analyser Path
    -                   Skip level (e.g., 'pathzer - rp')
    --                  Skip two levels

    CLI Examples:
    node pathzer ?=home/user/projects rp=full pp=0

    option: '?' , param: ['home/user/projects']
    option: 'rp', param: ['full']
    option: 'pp', param: ['0']

    Notes:
    - If more than the allowed maximum levels are provided, the program will throw an error.
    - Use the 'levels' function internally to process each level based on the provided options and parameters.

    For more information or detailed documentation, refer to the project's repository or README.md.
    `;
}

function systemHelp() {
    console.log(help());
}

function systemVersion() {
    console.log(version());
}

function systemOptionC(...param) {
    console.log(`System: Executing with parameter ${param}`);
}

// Level 1
function executeLevel1(result, option, ...param) {
    switch (option) {
        case '-i':
            case '-info':
            systemHelp();
            break;
        case '-v':
            case '-version':
            systemVersion();
            break;
        case '?':
            level1OptionA(...param);
            break;
        case 'b':
            level1OptionB(...param);
            break;
        case 'c':
            level1OptionC(...param);
            break;
        default:
            console.log('Invalid level 1 option.');
    }
    return result = 1;
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
    if (hierarchical) {
        console.log(result)
        if (levelFunctions[level]) {
            result = levelFunctions[level](result, option, ...param);
        } else {
            console.log(`Level ${level} not recognized.`);
        }

        if (level == MAX_LEVELS){
            console.log(JSON.stringify(result, null, 2));
        }
        
        return {
            level: level,
            option: option,
            param: param,
            result: result
        };
    }
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
    levels,
    help
};
