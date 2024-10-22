function main(structure, filterType, filters) {
    if (filters == undefined){return structure}

    const filterList = filters.split(',');
  
    // Função auxiliar para extrair o tamanho do arquivo a partir do formato da string
    function getFileSize(fileString) {
      const sizeInfo = fileString.match(/info-\(r\/w, ([0-9\.]+)\s*(bytes|KB|MB)\)-info/);
      if (!sizeInfo) return null;
  
      let size = parseFloat(sizeInfo[1]); // Tamanho numérico
      const unit = sizeInfo[2]; // Unidade: bytes, KB, MB
  
      // Converter para bytes, se necessário
      if (unit === 'KB') size *= 1024;
      if (unit === 'MB') size *= 1024 * 1024;
  
      return size;
    }
  
    // Função auxiliar para extrair o texto do arquivo
    function getFileText(fileString) {
      const textInfo = fileString.match(/text-\(([\s\S]+)\)-text/);
      return textInfo ? textInfo[1] : null;
    }
  
    // Função recursiva que exclui apenas o que se informa
    function filterDelete(arr) {
      const result = [];
  
      for (let i = 0; i < arr.length; i++) {
        const currentItem = arr[i];
  
        // Se for uma string (um arquivo ou pasta)
        if (typeof currentItem === 'string') {
          const isFile = currentItem.includes(';');
  
          // Aplica os filtros para nomes de arquivos (dn)
          if (filterType === 'dn' && isFile) {
            const fileName = currentItem.split(';')[0].split('.')[0]; // Nome do arquivo sem extensão
            if (!filterList.includes(fileName)) {
              result.push(currentItem); // Mantém o arquivo se o nome não estiver no filtro
            }
          }
  
          // Aplica os filtros para extensões de arquivos (de)
          else if (filterType === 'de' && isFile) {
            const fileExtension = currentItem.split(';')[0].split('.').pop(); // Extensão do arquivo
            if (!filterList.includes(fileExtension)) {
              result.push(currentItem); // Mantém o arquivo se a extensão não estiver no filtro
            }
          }
  
          // Aplica os filtros para tamanhos de arquivos (ds)
          else if (filterType === 'ds' && isFile) {
            const fileSize = getFileSize(currentItem); // Obtém o tamanho do arquivo
            if (fileSize !== null) {
              let keepFile = true;
  
              // Verifica os filtros de tamanho
              filterList.forEach((filter) => {
                // Se o filtro for um número sem sinal, adiciona o sinal de "-"
                if (!filter.startsWith('-') && !filter.startsWith('+') && !filter.includes(',')) {
                  filter = `-${filter}`;
                }
  
                if (filter.startsWith('-')) {
                  // Excluir arquivos menores ou iguais ao tamanho especificado
                  const maxSize = parseFloat(filter.substring(1));
                  if (fileSize <= maxSize) keepFile = false;
                } else if (filter.startsWith('+')) {
                  // Excluir arquivos maiores que o tamanho especificado
                  const minSize = parseFloat(filter.substring(1));
                  if (fileSize > minSize) keepFile = false;
                } else if (filter.includes(',')) {
                  // Excluir arquivos dentro de um intervalo de tamanho
                  const [minSize, maxSize] = filter.split(',').map(Number);
                  if (fileSize >= minSize && fileSize <= maxSize) keepFile = false;
                }
              });
  
              if (keepFile) {
                result.push(currentItem); // Mantém o arquivo se ele passar no filtro de tamanho
              }
            }
          }
  
          // Aplica os filtros para texto de arquivos (dt)
          else if (filterType === 'dt' && isFile) {
            const fileText = getFileText(currentItem); // Obtém o texto do arquivo
            if (fileText !== null) {
              let keepFile = true;
  
              // Verifica os filtros de texto
              filterList.forEach((filter) => {
                if (fileText.includes(filter)) {
                  keepFile = false; // Exclui o arquivo se o texto contém uma das palavras do filtro
                }
              });
  
              if (keepFile) {
                result.push(currentItem); // Mantém o arquivo se ele passar no filtro de texto
              }
            } else {
              result.push(currentItem); // Mantém arquivos que não tenham texto
            }
          }
  
          // Caso seja uma pasta (não contém ';'), mantém a pasta
          else if (!isFile) {
            result.push(currentItem);
          }
        }
  
        // Se for um array aninhado (subpasta), chamamos a função recursivamente
        else if (Array.isArray(currentItem)) {
          const filteredSubArray = filterDelete(currentItem);
          
          // Se o array estiver vazio e o item anterior (pasta) não for um arquivo, remove ambos
          if (filteredSubArray.length === 0 && typeof result[result.length - 1] === 'string' && !result[result.length - 1].includes(';')) {
            result.pop(); // Remove o nome da pasta
          } else {
            result.push(filteredSubArray); // Mantém subarrays que tenham conteúdo
          }
        }
      }
  
      return result;
    }

    // Função recursiva que inclui apenas o que se informa
    function filterKeep(arr) {
        const result = [];
  
      for (let i = 0; i < arr.length; i++) {
        const currentItem = arr[i];
  
        // Se for uma string (um arquivo ou pasta)
        if (typeof currentItem === 'string') {
          const isFile = currentItem.includes(';');
  
          // Aplica os filtros para nomes de arquivos (dn)
          if (filterType === 'kn' && isFile) {
            const fileName = currentItem.split(';')[0].split('.')[0]; // Nome do arquivo sem extensão
            if (filterList.includes(fileName)) {
              result.push(currentItem); // Mantém o arquivo se o nome não estiver no filtro
            }
          }
  
          // Aplica os filtros para extensões de arquivos (de)
          else if (filterType === 'ke' && isFile) {
            const fileExtension = currentItem.split(';')[0].split('.').pop(); // Extensão do arquivo
            if (filterList.includes(fileExtension)) {
              result.push(currentItem); // Mantém o arquivo se a extensão não estiver no filtro
            }
          }
  
          // Aplica os filtros para tamanhos de arquivos (ds)
          else if (filterType === 'ks' && isFile) {
            const fileSize = getFileSize(currentItem); // Obtém o tamanho do arquivo
            if (fileSize !== null) {
              let keepFile = true;
  
              // Verifica os filtros de tamanho
              filterList.forEach((filter) => {
                // Se o filtro for um número sem sinal, adiciona o sinal de "-"
                if (!filter.startsWith('-') && !filter.startsWith('+') && !filter.includes(',')) {
                  filter = `-${filter}`;
                }
  
                if (filter.startsWith('-')) {
                  // Excluir arquivos menores ou iguais ao tamanho especificado
                  const maxSize = parseFloat(filter.substring(1));
                  if (fileSize <= maxSize) keepFile = false;
                } else if (filter.startsWith('+')) {
                  // Excluir arquivos maiores que o tamanho especificado
                  const minSize = parseFloat(filter.substring(1));
                  if (fileSize > minSize) keepFile = false;
                } else if (filter.includes(',')) {
                  // Excluir arquivos dentro de um intervalo de tamanho
                  const [minSize, maxSize] = filter.split(',').map(Number);
                  if (fileSize >= minSize && fileSize <= maxSize) keepFile = false;
                }
              });
  
              if (!keepFile) {
                result.push(currentItem); // Mantém o arquivo se ele passar no filtro de tamanho
              }
            }
          }
  
          // Aplica os filtros para texto de arquivos (dt)
          else if (filterType === 'kt' && isFile) {
            const fileText = getFileText(currentItem); // Obtém o texto do arquivo
            if (fileText !== null) {
              let keepFile = true;
  
              // Verifica os filtros de texto
              filterList.forEach((filter) => {
                if (fileText.includes(filter)) {
                  keepFile = false; // Exclui o arquivo se o texto contém uma das palavras do filtro
                }
              });
  
              if (!keepFile) {
                result.push(currentItem); // Mantém o arquivo se ele passar no filtro de texto
              }
            } else {
              result.push(currentItem); // Mantém arquivos que não tenham texto
            }
          }
  
          // Caso seja uma pasta (não contém ';'), mantém a pasta
          else if (!isFile) {
            result.push(currentItem);
          }
        }
  
        // Se for um array aninhado (subpasta), chamamos a função recursivamente
        else if (Array.isArray(currentItem)) {
          const filteredSubArray = filterKeep(currentItem);
          
          // Se o array estiver vazio e o item anterior (pasta) não for um arquivo, remove ambos
          if (filteredSubArray.length === 0 && typeof result[result.length - 1] === 'string' && !result[result.length - 1].includes(';')) {
            result.pop(); // Remove o nome da pasta
          } else {
            result.push(filteredSubArray); // Mantém subarrays que tenham conteúdo
          }
        }
      }
  
      return result;
    }
  
    if (filterType.startsWith("d")){
        return filterDelete(structure);
    } else if (filterType.startsWith("k")){
        return filterKeep(structure);
    } else {
        return structure;
    }
    
}
  

/**
 * @function filterPath
 * @param {String} result 
 * @param  {Array} param 
 * @returns {Object[]} result
 */
function filterPath(result, ...param){

  if (result.length != 0){
        for (let i = 0; i < (result.length); i++) {
        switch (param[0]) {
            case 'de':
                result[i] = main(result[i], "de", ...param.slice(1));
                break;
            case 'dn':
                result[i] = main(result[i], "dn", ...param.slice(1));
                break;
            case 'ds':
                result[i] = main(result[i], "ds", ...param.slice(1));
                break;
            case 'dt':
                result[i] = main(result[i], "dt", ...param.slice(1));
                break;
            case 'ke':
                result[i] = main(result[i], "ke", ...param.slice(1));
                break;
            case 'kn':
                result[i] = main(result[i], "kn", ...param.slice(1));
                break;
            case 'ks':
                result[i] = main(result[i], "ks", ...param.slice(1));
                break;
            case 'kt':
                result[i] = main(result[i], "kt", ...param.slice(1));
                break;  
            case '/c':
                result[i] = main(result[i], ...param.slice(1));
                break;               
            default:
                result[i];
                break;
            }   
        }
    } else {
        obs = ["Result not found"]
    }
    return [result];
}

module.exports = filterPath;

/*
Result é analisado
modos:
Filtro de diretório:
Por Nomes:
"kdn" => keep directory name (inclui apenas o diretório informado)
"ddn" => delete directory name (exclui apenas o diretório informado)

Filtro de arquivos:
Por Nomes:
"kfn" => keep file name (inclui apenas o arquivo informado)
"dn" => delete file name (exclui apenas o arquivo informado)

Por Extensão:
"kfe" => keep file extension (inclui apenas o arquivo informado)
"de" => delete file extension (exclui apenas o arquivo informado)

Por Tamanho:
"kfs" => keep file size (inclui apenas até o intervalo de tamanho informado)
"ds" => delete file size (exclui apenas até o intervalo de tamanho informado)

Por Palavra chave interna:
"kt" => keep file word (inclui apenas o arquivo informado)
"dt" => delete file word (exclui apenas o arquivo informado)

Duas operações distintas:
keep e delete

Operação unica:
identificar pasta ou arquivo

Uma entrada e uma saida

*/