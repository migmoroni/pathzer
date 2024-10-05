const path = require('path');
const fs = require('fs');
const { MAX_LEVELS, levels } = require('./lib/levels');

// Function to load the cache path based on the ID (e.g., pXX)
function loadCachePath(code) {
  const homeDir = require('os').homedir();
  const cacheFilePath = path.join(homeDir, 'pathzer', 'paths.json');

  if (!fs.existsSync(cacheFilePath)) {
    console.log('Cache file not found.');
    return null;
  }

  const cache = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'));

  const id = code.slice(1); // Remove '?' from the code to get the ID

  if (cache[id]) {
    console.log(`Path found for ${code}: ${cache[id]}`);
    return cache[id];
  } else {
    console.log(`Path not found for code ${code}`);
    return null;
  }
}

// Function to load all cache IDs (for '?' command)
function loadCacheIds() {
  const homeDir = require('os').homedir();
  const cacheFilePath = path.join(homeDir, 'pathzer', 'paths.json');

  if (!fs.existsSync(cacheFilePath)) {
    console.log('Cache file not found.');
    return [];
  }

  const cache = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'));

  return Object.keys(cache);
}

// Function to load cache IDs with their paths (for '?f' command)
function loadCacheIdsWithPaths() {
  const homeDir = require('os').homedir();
  const cacheFilePath = path.join(homeDir, 'pathzer', 'paths.json');

  if (!fs.existsSync(cacheFilePath)) {
    console.log('Cache file not found.');
    return {};
  }

  const cache = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'));

  return cache;
}

// Function that processes the letter command and multiple parameters
function processBlock(block) {
  const option = block[0]; // First letter
  const param = block.slice(1).split('.'); // Parameters separated by comma
  return { option, param };
}

// Function that pre-processes the commands and separates blocks with multiple parameters
function preprocessCommands(command) {
  const separatedCommands = [];
  let buffer = '';

  for (let i = 0; i < command.length; i++) {
    const char = command[i];
    console.log("char: "+ char)
    if (char === ','){
      continue;
    }
    if (isNaN(char) && char !== '.') {
      // Found a letter, push the previous buffer and start a new one
      if (buffer) {
        separatedCommands.push(buffer);
        console.log("separatedCommands: "+ separatedCommands)
      }
      buffer = char;
    } else {
      // If it's a number or comma, add it to the current buffer
      buffer += char;
    }
  }

  console.log("bu "+buffer)
  // Push the last buffer
  if (buffer) {
    separatedCommands.push(buffer);
  }

  return separatedCommands;
}

// Main function
function pathzer(dir = process.cwd(), ...commands) {
  if (commands.length === 0) {
    console.log(levels(0, 'i'));
    return;
  }

  let path = dir;
  let operations = commands.join(''); // Join commands into a single string

  // If the first argument is a path code like ?XX, fetch from cache
  if (path.startsWith('?')) {
    const code = path;

    if (code.startsWith('?=')) {
      const newPath = code.slice(2).split(' ')[0]; // Get everything after "?=" until the first space
      console.log('Manual path set to:', newPath);
      // You may want to proceed with further operations using the new path here
      return { newPath }; // Exit after setting the path
    }

    if (code === '?') {
      const cacheIds = loadCacheIds();
      console.log('Cache IDs:', cacheIds);
      return { cacheIds };
    }

    if (code === '?f') {
      const cacheWithPaths = loadCacheIdsWithPaths();
      console.log('Cache IDs with paths:', cacheWithPaths);
      return { cacheWithPaths };
    }

    const cachePath = loadCachePath(code);
    if (cachePath) {
      path = cachePath;
    } else {
      console.log('Error: Path not found in cache.');
      return;
    }
  }
  console.log("op "+ operations)
  // Pre-processing for commands like "a1,3b1,7c2" or "a1,3 b1,7 c2"
  const separatedCommands = preprocessCommands(operations);

  console.log("se "+ separatedCommands)
  let result = {
    path,
    commands: [],
  };

  for (let i = 0; i < separatedCommands.length && i < MAX_LEVELS; i++) {
    const command = separatedCommands[i];

    // Skip if it's '-' to skip a level
    if (command === '-') {
      continue;
    }
    console.log("co" + command)
    // Process the block to separate the letter and parameters
    const { option, param } = processBlock(command);

    console.log(option, param)
    // Execute the levels
    levels(i + 1, option, ...param);

    result.commands.push({ level: i + 1, option, param });
  }

  if (separatedCommands.length > MAX_LEVELS) {
    console.log(`Warning: Only the first ${MAX_LEVELS} levels were processed. Remaining commands were ignored.`);
  }

  return result;
}

// If running via command line
if (require.main === module) {
  const args = process.argv.slice(2);
  const firstArg = args[0] || '';

  switch (firstArg) {
    case '-i':
    case '--info':
      case undefined:
      case '':
      case '/\s/gi':
        levels(0, 'i');
        break;

    case '-v':
    case '--version':
        levels(0, 'v');
        break;

    default:
      const dir = process.cwd();
      const commands = args;
      const result = pathzer(dir, ...commands);
      console.log(JSON.stringify(result, null, 2));
      break;
  }
}

module.exports = pathzer;
