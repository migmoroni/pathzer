function version() {
  console.log('pathzer version 1.0.0');
}

function help() {
  console.log(`
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
  `);
}

module.exports = {
  version,
  help
};