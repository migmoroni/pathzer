const fs = require('fs');
const path = require('path');
let info = '';

function version() {
  return info = ['pathzer version','1.0.0'];
}

function help() {
  return info = `
  Usage: pathzer [levels]

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

function isValidPath(passedPath) {
  try {
    // Resolve o caminho para um formato absoluto
    const resolvedPath = path.resolve(passedPath);
    
    // Verify
    if ((!fs.existsSync(resolvedPath)) || (resolvedPath == '/')) {
      info = 'Path not exist';
      return false;
    }

    // Is File or Folder?
    const stats = fs.lstatSync(resolvedPath);
    
    if (stats.isFile()) {
      info = 'Its a File Path';
    } else if (stats.isDirectory()) {
      info = 'Its a Folder Path';
    } else {
      info = 'Undefined Path';
    }
    
    return true;
  } catch (err) {
    console.error('Verify Path error:', err);
    return false;
  }
}

function rootPath(obs, result, ...param){
  for (let i = 0; i < param.length; i++) {
    if (!param[i].startsWith('/')) {
      param[i] = '/' + param[i];
    }

    if (param[i] == (undefined || '')){
      result[i] = process.cwd();
    } else if (isValidPath(param[i])){
      result[i] = param[i];
    } else {
      result[i] = null
    }
    
    obs[i] = info;

  };
  return [result, obs];
}

module.exports = {
  rootPath,
  version,
  help
};