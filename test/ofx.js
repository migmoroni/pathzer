function formatToOFX(structure) {
    let ofxOutput = '<?xml version="1.0" encoding="UTF-8"?>\n<OFX>\n';
  
    // Função recursiva para percorrer a estrutura aninhada e gerar o conteúdo OFX
    function formatRecursively(arr, level = 1) {
      let result = '';
      const indent = '  '.repeat(level); // Indentação para manter a hierarquia de tags
  
      for (let i = 0; i < arr.length; i++) {
        const currentItem = arr[i];
  
        // Se for uma string (um diretório ou arquivo)
        if (typeof currentItem === 'string') {
          const isFile = currentItem.includes(';');
  
          // Se for um arquivo
          if (isFile) {
            const [fileName, info, text] = currentItem.split(';').map(str => str.trim());
  
            // Extrai informações do arquivo
            const fileSize = info.match(/\(([^)]+)\)/)[1]; // Extraindo o tamanho do arquivo
            const fileText = text.match(/\(([\s\S]+)\)/)[1]; // Extraindo o texto do arquivo
  
            result += `${indent}<FILE>\n`;
            result += `${indent}  <FILENAME>${fileName}</FILENAME>\n`;
            result += `${indent}  <FILESIZE>${fileSize}</FILESIZE>\n`;
            result += `${indent}  <FILETEXT><![CDATA[${fileText}]]></FILETEXT>\n`;
            result += `${indent}</FILE>\n`;
          }
          // Se for um diretório
          else {
            result += `${indent}<DIR>\n`;
            result += `${indent}  <DIRNAME>${currentItem}</DIRNAME>\n`;
          }
        }
        // Se for um array (subdiretório ou subarquivos), chamamos recursivamente
        else if (Array.isArray(currentItem)) {
          result += formatRecursively(currentItem, level + 1);
  
          // Fechar a tag de diretório ao final de seus conteúdos
          if (typeof arr[i - 1] === 'string' && !arr[i - 1].includes(';')) {
            result += `${indent}</DIR>\n`;
          }
        }
      }
  
      return result;
    }
  
    // Inicia a formatação recursiva da estrutura
    ofxOutput += formatRecursively(structure);
    ofxOutput += '</OFX>';
  
    return ofxOutput;
  }
  
  // Exemplo de uso
  const estrutura = [
    "Projetos/Pessoais/pathzer/rootTest",
    [
      "Brazil",
      [
        "Computer-Language",
        [
          "Elixir",
          [
            "script.ex; {info-(0.000 MB)-info}; {text-(IO.puts(\"Hello, World! 23\"))-text}"
          ],
          "Lua",
          [
            "script.lua; {info-(0.000 MB)-info}; {text-(print(\"Hello, World!\"))-text}"
          ]
        ],
        "Writers",
        [
          "Augusto-dos-Anjos",
          [],
          "Gregorio-de-Matos",
          [],
          "Machado-de-Assis",
          []
        ]
      ],
      "EUA",
      [],
      "Switzerland",
      []
    ]
  ];
  
  // Gerar OFX
  const ofxResult = formatToOFX(estrutura);
  console.log(ofxResult);