/**
 * Filtra o retorno, em campos utilizaveis
 * 
 * @param {String} pathSource - A operação para onde deve ser processado os arquivos
 * 
 * @api public
 */

function filterPath(params) {
    // Separando as pastas dos arquivos
    const lastFolderIndex = params.findIndex(item => item.includes('.')) - 1;
    const folderPathArray = params.slice(0, lastFolderIndex + 1);
    const filesArray = params.slice(lastFolderIndex + 1);
  
    // Montando o path como string
    const folderPath = folderPathArray.join('/');
  
    return {
      path: folderPath,          // Path como string
      folders: folderPathArray,  // Vetor de pastas
      files: filesArray          // Vetor de arquivos
    };
  }
    
  module.exports = filterPath;