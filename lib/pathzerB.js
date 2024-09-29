const path = require('path');
const fs = require('fs');

// Função para carregar o caminho do cache com base no ID (exemplo pXX)
function carregarCaminhoDoCache(codigo) {
  const homeDir = require('os').homedir();
  const cacheFilePath = path.join(homeDir, 'programa', 'paths.json');
  
  if (!fs.existsSync(cacheFilePath)) {
    console.log('Arquivo de cache não encontrado.');
    return null;
  }

  const cache = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'));

  const id = codigo.slice(1); // Remove o '*' do código para pegar o ID

  if (cache[id]) {
    console.log(`Caminho encontrado para ${codigo}: ${cache[id]}`);
    return cache[id];
  } else {
    console.log(`Caminho não encontrado para o código ${codigo}`);
    return null;
  }
}

// Função que separa a letra do comando e os múltiplos parâmetros
function processarBloco(bloco) {
  const opcao = bloco[0]; // Primeira letra
  const param = bloco.slice(1).split(','); // Parâmetros separados por vírgula
  return { opcao, param };
}

// Função que pré-processa os comandos e separa blocos com múltiplos parâmetros
function preprocessarComandos(comando) {
  const comandosSeparados = [];
  let buffer = '';

  for (let i = 0; i < comando.length; i++) {
    const char = comando[i];

    if (isNaN(char) && char !== ',') {
      // Encontrou uma letra, empurra o buffer anterior e começa um novo
      if (buffer) {
        comandosSeparados.push(buffer);
      }
      buffer = char;
    } else {
      // Se é um número ou vírgula, adiciona ao buffer atual
      buffer += char;
    }
  }

  // Empurrar o último buffer
  if (buffer) {
    comandosSeparados.push(buffer);
  }

  return comandosSeparados;
}

// Funções de exemplo para cada nível
function nivel1OpcaoA(param = 1) {
  console.log(`Nível 1, Opção A: Executando com parâmetro ${param}`);
}
function nivel1OpcaoB(param = 1) {
  console.log(`Nível 1, Opção B: Executando com parâmetro ${param}`);
}
function nivel1OpcaoC(param = 1) {
  console.log(`Nível 1, Opção C: Executando com parâmetro ${param}`);
}

function nivel2OpcaoA(param = 1) {
  console.log(`Nível 2, Opção A: Executando com parâmetro ${param}`);
}
function nivel2OpcaoB(param = 1) {
  console.log(`Nível 2, Opção B: Executando com parâmetro ${param}`);
}
function nivel2OpcaoC(param = 1) {
  console.log(`Nível 2, Opção C: Executando com parâmetro ${param}`);
}

function nivel3OpcaoA(param = 1) {
  console.log(`Nível 3, Opção A: Executando com parâmetro ${param}`);
}
function nivel3OpcaoB(param = 1) {
  console.log(`Nível 3, Opção B: Executando com parâmetro ${param}`);
}
function nivel3OpcaoC(param = 1) {
  console.log(`Nível 3, Opção C: Executando com parâmetro ${param}`);
}

function nivel4OpcaoA(param = 1) {
  console.log(`Nível 4, Opção A: Executando com parâmetro ${param}`);
}
function nivel4OpcaoB(param = 1) {
  console.log(`Nível 4, Opção B: Executando com parâmetro ${param}`);
}
function nivel4OpcaoC(param = 1) {
  console.log(`Nível 4, Opção C: Executando com parâmetro ${param}`);
}

// Função principal
function programa(dir = process.cwd(), ...commands) {
  if (commands.length === 0) {
    console.log(menuDeAjuda());
    return;
  }

  let caminho = dir;
  let operacoes = commands.join(''); // Junta os comandos em uma única string

  // Se o primeiro argumento for um código de caminho como pXX, busca no cache
  if (caminho.startsWith('*')) {
    const caminhoDoCache = carregarCaminhoDoCache(caminho);
    if (caminhoDoCache) {
      caminho = caminhoDoCache;
    } else {
      console.log('Erro: Caminho não encontrado no cache.');
      return;
    }
    caminho = caminhoDoCache;
  }

  // Pré-processamento para comandos como "a1,3b1,7c2" ou "a1,3 b1,7 c2"
  const comandosSeparados = preprocessarComandos(operacoes);

  let resultado = {
    caminho,
    comandos: [],
  };

  for (let i = 0; i < comandosSeparados.length; i++) {
    const comando = comandosSeparados[i];

    // Ignora se for '0' para pular um nível
    if (comando === '-') {
      continue;
    }

    // Processar o bloco para separar a letra e os parâmetros
    const { opcao, param } = processarBloco(comando);

    // Divide o comando em letra e número
    //const opcao = comando[0]; // Ex: 'a' de 'a1'
    //const param = comando.slice(1) || '1'; // Ex: '1' de 'a1', padrão para '1' se vazio

    switch (i) {
      case 0:
        executarNivel1(opcao, ...param);
        break;
      case 1:
        executarNivel2(opcao, ...param);
        break;
      case 2:
        executarNivel3(opcao, ...param);
        break;
      case 3:
        executarNivel4(opcao, ...param);
        break;
      default:
        console.log(`Nível ${i + 1} não reconhecido.`);
    }

    resultado.comandos.push({ nivel: i + 1, opcao, param });
  }

  return resultado;
}

// Função para executar o nível 1
function executarNivel1(opcao, ...param) {
  switch (opcao) {
    case 'a':
      nivel1OpcaoA(...param);
      break;
    case 'b':
      nivel1OpcaoB(...param);
      break;
    case 'c':
      nivel1OpcaoC(...param);
      break;
    default:
      console.log('Opção de Nível 1 inválida.');
  }
}

// Função para executar o nível 2
function executarNivel2(opcao, ...param) {
  switch (opcao) {
    case 'a':
      nivel2OpcaoA(...param);
      break;
    case 'b':
      nivel2OpcaoB(...param);
      break;
    case 'c':
      nivel2OpcaoC(...param);
      break;
    default:
      console.log('Opção de Nível 2 inválida.');
  }
}

// Função para executar o nível 3
function executarNivel3(opcao, ...param) {
  switch (opcao) {
    case 'a':
      nivel3OpcaoA(...param);
      break;
    case 'b':
      nivel3OpcaoB(...param);
      break;
    case 'c':
      nivel3OpcaoC(...param);
      break;
    default:
      console.log('Opção de Nível 3 inválida.');
  }
}

// Função para executar o nível 4
function executarNivel4(opcao, ...param) {
  switch (opcao) {
    case 'a':
      nivel4OpcaoA(...param);
      break;
    case 'b':
      nivel4OpcaoB(...param);
      break;
    case 'c':
      nivel4OpcaoC(...param);
      break;
    default:
      console.log('Opção de Nível 4 inválida.');
  }
}

// Função que exibe o menu de ajuda
function menuDeAjuda() {
  return `
  Uso do programa:
  node programa '/path' [a1] [b1] [c1] [d1]
  
  - Se o caminho for omitido, usa o diretório atual.
  - Você pode usar um código de caminho do cache (ex: p21).
  - As letras representam a operação para cada nível, e os números representam o parâmetro (padrão "1").
  - Se o número não for informado, usa o valor padrão 1.
  - Para pular um nível, use "0".
  - Exemplos:
    node programa '/path' a1 b1 c1
    node programa p21 0 b1 a2
  
  Outros comandos:
  node programa -i   Mostra o menu de ajuda.
  node programa -v   Mostra a versão.
  `;
}

// Função que exibe a versão
function versao() {
  return 'Versão 1.0.0';
}

// Se rodar via linha de comando
if (require.main === module) {
  const args = process.argv.slice(2);
  const primeiroArg = args[0] || '';

  switch (primeiroArg) {
    case '-i':
      console.log(menuDeAjuda());
      break;
    
    case '-v':
      console.log(versao());
      break;

    case undefined:
    case '':
      console.log(menuDeAjuda());
      break;

    default:
      const dir = primeiroArg.startsWith('*') ? primeiroArg : process.cwd();
      const commands = primeiroArg.startsWith('*') ? args.slice(1) : args;
      const resultado = programa(dir, ...commands);
      console.log(JSON.stringify(resultado, null, 2));
      break;
  }
}

module.exports = programa;
