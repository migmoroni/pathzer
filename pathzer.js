const path = require('path');
const fs = require('fs');
const levels = require('./lib/levels');

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

// Function to load cache IDs with their paths (for 'pf' command)
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
  const param = block.slice(1).split(','); // Parameters separated by comma
  return { option, param };
}

// Function that pre-processes the commands and separates blocks with multiple parameters
function preprocessCommands(command) {
  const separatedCommands = [];
  let buffer = '';

  for (let i = 0; i < command.length; i++) {
    const char = command[i];

    if (isNaN(char) && char !== ',') {
      // Found a letter, push the previous buffer and start a new one
      if (buffer) {
        separatedCommands.push(buffer);
      }
      buffer = char;
    } else {
      // If it's a number or comma, add it to the current buffer
      buffer += char;
    }
  }

  // Push the last buffer
  if (buffer) {
    separatedCommands.push(buffer);
  }

  return separatedCommands;
}

// Main function
function pathzer(dir = process.cwd(), ...commands) {
  if (commands.length === 0) {
    console.log(help());
    return;
  }

  let path = dir;
  let operations = commands.join(''); // Join commands into a single string

  // If the first argument is a path code like pXX, fetch from cache
  if (path.startsWith('?')) {
    const code = path;

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

  // Pre-processing for commands like "a1,3b1,7c2" or "a1,3 b1,7 c2"
  const separatedCommands = preprocessCommands(operations);

  let result = {
    path,
    commands: [],
  };

  for (let i = 0; i < separatedCommands.length; i++) {
    const command = separatedCommands[i];

    // Skip if it's '0' to skip a level
    if (command === '-') {
      continue;
    }

    // Process the block to separate the letter and parameters
    const { option, param } = processBlock(command);

    // Execute the levels
    levels(i, option, param);

    result.commands.push({ level: i + 1, option, param });
  }

  return result;
}

// Function to show the help menu
function help() {
  return `
  Usage of pathzer:
  node pathzer '/path' [a1] [b1] [c1] [d1]
  
  - If the path is omitted, it uses the current directory.
  - You can use a cached path code (e.g., ?21).
  - The letters represent the operation for each level, and the numbers represent the parameter (default "1").
  - If the number is not provided, it defaults to 1.
  - To skip a level, use "0".
  - Examples:
    node pathzer '/path' a1 b1 c1
    node pathzer p21 0 b1 a2
  
  Other commands:
  node pathzer -i   Shows the help menu.
  node pathzer -v   Shows the version.
  `;
}

// Function to show the version
function version() {
  return 'Version 0.9.0';
}

// If running via command line
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

    case undefined:
    case '':
      console.log(help());
      break;

    default:
      const dir = firstArg.startsWith('?') ? firstArg : process.cwd();
      const commands = args;
      const result = pathzer(dir, ...commands);
      console.log(JSON.stringify(result, null, 2));
      break;
  }
}

module.exports = pathzer;
