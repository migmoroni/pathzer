// Importando a biblioteca avsc
const avro = require('avsc');

// Definindo o schema Avro
const directorySchema = avro.Type.forSchema({
  type: 'record',
  name: 'Directory',
  fields: [
    { name: 'name', type: 'string' }, // Nome da pasta ou diretório
    { name: 'files', type: { type: 'array', items: ['null', 'File', 'Directory'] } } // Arquivos ou subdiretórios
  ]
});

const fileSchema = avro.Type.forSchema({
  type: 'record',
  name: 'File',
  fields: [
    { name: 'fileName', type: 'string' }, // Nome do arquivo
    { name: 'info', type: 'string' }, // Informações sobre o arquivo
    { name: 'text', type: 'string' } // Conteúdo do arquivo
  ]
});

// Função para formatar o array aninhado para o formato Avro
function formatToAvro(structure) {
  function processStructure(arr) {
    const result = {
      name: arr[0], // Nome da pasta ou diretório
      files: []
    };

    for (let i = 1; i < arr.length; i++) {
      const currentItem = arr[i];

      if (typeof currentItem === 'string') {
        // Processando arquivos (nomes de arquivo com metadados)
        if (currentItem.includes(';')) {
          const [fileName, info, text] = currentItem.split(';').map(str => str.trim());
          result.files.push({
            fileName: fileName,
            info: info.match(/\(([^)]+)\)/)[1], // Extraindo as informações
            text: text.match(/\(([\s\S]+)\)/)[1] // Extraindo o conteúdo do texto
          });
        }
      } else if (Array.isArray(currentItem)) {
        // Processando diretórios recursivamente
        result.files.push(processStructure(currentItem));
      }
    }

    return result;
  }

  // Processa a estrutura e retorna no formato Avro
  const avroData = processStructure(structure);

  // Converte os dados para o formato Avro binário
  const buffer = directorySchema.toBuffer(avroData);
  return buffer;
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

// Gerar os dados Avro a partir da estrutura
const avroResult = formatToAvro(estrutura);

// Para salvar os dados em um arquivo Avro, você pode usar o módulo 'fs'
const fs = require('fs');
fs.writeFileSync('output.avro', avroResult);

console.log('Arquivo Avro gerado com sucesso!');
