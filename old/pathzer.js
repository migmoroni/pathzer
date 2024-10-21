const path = require('path');
const fs = require('fs');

// Function to load the path from the cache based on the ID (e.g., pXX)
function loadCachePath(code) {
  const homeDir = require('os').homedir();
  const cacheFilePath = path.join(homeDir, 'pathzer', 'paths.json');
  
  if (!fs.existsSync(cacheFilePath)) {
    console.log('Cache file not found.');
    return null;
  }

  const cache = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'));
  const id = code.slice(1); // Remove the 'p' from the code to get the ID

  return cache[id] || null;
}

// Function to return all cache IDs
function listCacheIds() {
  const homeDir = require('os').homedir();
  const cacheFilePath = path.join(homeDir, 'pathzer', 'paths.json');
  
  if (!fs.existsSync(cacheFilePath)) {
    console.log('Cache file not found.');
    return null;
  }

  const cache = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'));
  const ids = Object.keys(cache);
  console.log('List of cache IDs:', ids);
  return ids;
}

// Function to return all cache IDs with paths
function listCacheIdsWithPaths() {
  const homeDir = require('os').homedir();
  const cacheFilePath = path.join(homeDir, 'pathzer', 'paths.json');
  
  if (!fs.existsSync(cacheFilePath)) {
    console.log('Cache file not found.');
    return null;
  }

  const cache = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'));
  const entries = Object.entries(cache);
  entries.forEach(([id, path]) => {
    console.log(`ID: ${id}, Path: ${path}`);
  });
  return entries;
}

// Main function
// Main function
function pathzer(dir = process.cwd(), ...commands) {
  if (commands.length === 0) {
    console.log(help());
    return;
  }

  let path = dir;
  let operations = commands.join(''); // Joins commands into a single string

  // Handle special cases for p, pf
  if (path === 'p') {
    listCacheIds();
    return;
  }

  if (path === 'pf') {
    listCacheIdsWithPaths();
    return;
  }

  // If the first argument is a path code like pXX, fetch from cache
  if (path.startsWith('p') && path.length > 1) {
    const cachePath = loadCachePath(path);
    if (cachePath) {
      console.log(`Path for ${path}: ${cachePath}`);
      return;
    } else {
      console.log('Error: Path not found in cache.');
      return;
    }
  }

  // Process commands
  const separatedCommands = preprocessCommands(operations);

  let result = {
    path,
    commands: [],
  };

  for (let i = 0; i < separatedCommands.length; i++) {
    const command = separatedCommands[i];

    // Process the block to separate the option and parameters
    const { option, param } = processBlock(command);

    switch (i) {
      case 0:
        executeLevel1(option, ...param);
        break;
      case 1:
        executeLevel2(option, ...param);
        break;
      case 2:
        executeLevel3(option, ...param);
        break;
      case 3:
        executeLevel4(option, ...param);
        break;
      default:
        console.log(`Level ${i + 1} not recognized.`);
    }

    result.commands.push({ level: i + 1, option, param });
  }

  return result;
}

// Function to process a block (e.g., a1,3)
function processBlock(block) {
  const option = block[0]; // First letter
  const param = block.slice(1).split(','); // Parameters separated by commas
  return { option, param };
}

// Preprocess commands into individual blocks (e.g., "a1,3b1,7c2")
function preprocessCommands(command) {
  const separatedCommands = [];
  let buffer = '';

  for (let i = 0; i < command.length; i++) {
    const char = command[i];

    if (isNaN(char) && char !== ',') {
      // If it's a letter, push the previous buffer and start a new one
      if (buffer) {
        separatedCommands.push(buffer);
      }
      buffer = char;
    } else {
      buffer += char;
    }
  }

  // Push the last buffer
  if (buffer) {
    separatedCommands.push(buffer);
  }

  return separatedCommands;
}

// Example functions for each level
function level1OptionA(param = 1) {
  console.log(`Level 1, Option A: Running with parameter ${param}`);
}
function level1OptionB(param = 1) {
  console.log(`Level 1, Option B: Running with parameter ${param}`);
}
function level1OptionC(param = 1) {
  console.log(`Level 1, Option C: Running with parameter ${param}`);
}

function level2OptionA(param = 1) {
  console.log(`Level 2, Option A: Running with parameter ${param}`);
}
function level2OptionB(param = 1) {
  console.log(`Level 2, Option B: Running with parameter ${param}`);
}
function level2OptionC(param = 1) {
  console.log(`Level 2, Option C: Running with parameter ${param}`);
}

// More levels... (level3OptionA, level3OptionB, etc.)

// Help function
function help() {
  return `
  Usage of pathzer:
  node pathzer '/path' [a1] [b1] [c1] [d1]
  
  - If the path is omitted, the current directory is used.
  - You can use a path code from the cache (e.g., p21).
  - Letters represent the operation for each level, and numbers represent the parameter (default is "1").
  - If the number is omitted, the default value is 1.
  - To skip a level, use "0".
  - Examples:
    node pathzer '/path' a1 b1 c1
    node pathzer p21 0 b1 a2
  
  Other commands:
  node pathzer p   Show a list of cache IDs.
  node pathzer pf  Show a list of cache IDs with paths.
  node pathzer -i  Show the help menu.
  node pathzer -v  Show the version.
  `;
}

// Version function
function version() {
  return 'Version 1.0.0';
}

// If run via command line
if (require.main === module) {
  const args = process.argv.slice(2);
  const firstArg = args[0] || '';

  switch (firstArg) {
    case '-i':
      console.log(help());
      break;
    
    case '-v':
    case '-version':
      console.log(version());
      break;

    case 'p':
      listCacheIds();
      break;

    case 'pf':
      listCacheIdsWithPaths();
      break;

    default:
      // Check if the first argument is a cache ID like p12
      if (firstArg.startsWith('p')) {
        const cachePath = loadCachePath(firstArg);
        if (cachePath) {
          console.log(`Path for ${firstArg}: ${cachePath}`);
        } else {
          console.log('Error: Path not found in cache.');
        }
      } else {
        const dir = firstArg.startsWith('p') ? firstArg : process.cwd();
        const commands = firstArg.startsWith('p') ? args.slice(1) : args;
        const result = pathzer(dir, ...commands);
        console.log(JSON.stringify(result, null, 2));
      }
      break;
    }
}
module.exports = pathzer;
