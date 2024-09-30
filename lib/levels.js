

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

function nivel1OpcaoA(param = 1) {
    console.log(`Nível 1, Opção A: Executando com parâmetro ${param}`);
}
function nivel1OpcaoB(param = 1) {
    console.log(`Nível 1, Opção B: Executando com parâmetro ${param}`);
}
function nivel1OpcaoC(param = 1) {
    console.log(`Nível 1, Opção C: Executando com parâmetro ${param}`);
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

function nivel2OpcaoA(param = 1) {
    console.log(`Nível 2, Opção A: Executando com parâmetro ${param}`);
}
function nivel2OpcaoB(param = 1) {
    console.log(`Nível 2, Opção B: Executando com parâmetro ${param}`);
}
function nivel2OpcaoC(param = 1) {
    console.log(`Nível 2, Opção C: Executando com parâmetro ${param}`);
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

function nivel3OpcaoA(param = 1) {
    console.log(`Nível 3, Opção A: Executando com parâmetro ${param}`);
}
function nivel3OpcaoB(param = 1) {
    console.log(`Nível 3, Opção B: Executando com parâmetro ${param}`);
}
function nivel3OpcaoC(param = 1) {
    console.log(`Nível 3, Opção C: Executando com parâmetro ${param}`);
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

function nivel4OpcaoA(param = 1) {
    console.log(`Nível 4, Opção A: Executando com parâmetro ${param}`);
}
function nivel4OpcaoB(param = 1) {
    console.log(`Nível 4, Opção B: Executando com parâmetro ${param}`);
}
function nivel4OpcaoC(param = 1) {
    console.log(`Nível 4, Opção C: Executando com parâmetro ${param}`);
}

function levels(level, opcao, ...param){
    switch (level) {
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
          console.log(`Nível ${level + 1} não reconhecido.`);
      }

}

module.exports = levels;