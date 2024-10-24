#!/usr/bin/env node

const { levels, MAX_LEVELS } = require('./lib/levels');
const { help } = require('./lib/options');

/****
 * @function pathzer
 * @description Função responsável por processar até N níveis hierárquicos, cada nível contendo uma "option" e um conjunto de "param".
 * @public
 * 
 * @param {Object[]} inputLevels - Um array contendo até MAX_LEVELS objetos de níveis hierárquicos. Cada objeto deve ter a seguinte estrutura:
 *  - {string} option - A opção do nível, representando a função ou ação que será executada.
 *  - {Array<string>} param - Um array de strings representando os parâmetros associados à opção.
 *  - Caso o nível deva ser pulado, pode-se usar `null` no lugar do objeto.
 * 
 * @returns {Array<Object|null>} Um array de objetos representando os níveis processados. Cada objeto possui as chaves:
 *  - {number} level - O número do nível, começando em 1.
 *  - {string} option - A opção (função) processada para aquele nível.
 *  - {Array<string>} param - Um array de parâmetros associados àquela opção.
 *  - Se um nível for pulado, o valor `null` será retornado na posição correspondente.
 * 
 * @throws {Error} Se o número de níveis exceder o limite definido em MAX_LEVELS.
 * 
 * @example
 * 
 * pathzer('?=home/user/projects', 'rp=f', 'pp=0')
 *  
 * option: '?' , param: ['home/user/projects']
 * option: 'rp', param: ['full']
 * option: 'pp', param: ['0']
 * 
 ****/

function pathzer(...argv) {
    const args = argv.join(' ');
    if (!args) {
        return help();
    } else {
        const parsedLevels = processFirst(args);
        const result = main(...parsedLevels);
        
        return result;
    }
}

function main(...inputLevels) {
    let result = []
    if (inputLevels.length > MAX_LEVELS) {
        throw new Error(`Exceeded the maximum number of allowed levels (${MAX_LEVELS}).`);
    }

    const results = [];

    inputLevels.forEach((level, index) => {
        if (level) {
            const { option, param } = level;
            results.push(levels(result, index + 1, option, ...param));
        } else {
            results.push(null);  
        }
    });

    return results;
}

function processLevel(levelStr) {
    const [option, rest] = levelStr.split("=");

    let params = [];
    
    if (rest) {
        // Regex para capturar blocos aninhados, incluindo os colchetes externos
        const regex = /\[([^\[\]]*(?:\[[^\[\]]*\])*[^\[\]]*)\]|[^,\[\]]+/g;

        // Captura os parâmetros com a regex
        params = rest.match(regex) || [];
       
        params = params.map(param => {
            // Mantém blocos com colchetes aninhados intactos
            if (param.startsWith('[') && param.endsWith(']')) {
                return param;
            }
            // Remove colchetes simples
            return param.replace(/[\[\]]/g, '');
        });
    }
    /*
    if (rest) {
        // Regex para dividir params em vírgulas, mas preservando os colchetes como um bloco
        params = rest.match(/\[.*?\]|[^,\[\]]+/g) || [];
        // Função para remover colchetes
        params = params.map(param => param.replace(/[\[\]]/g, ''));
    }
    */
    return { option, param: params };
}

function processFirst(args){
    const parsedLevels = [];
    const blocks = args.split(/\s/);
    let levelCount = 0;

    blocks.forEach((block) => {
        const dashMatch = block.match(/^-+$/);

        if (dashMatch) {
            const dashCount = dashMatch[0].length;
            for (let i = 0; i < dashCount; i++) {
                parsedLevels.push(null);
                levelCount++;
            }
        } else if (block.trim()) {
            parsedLevels.push(processLevel(block));
            levelCount++;
        }
    });


    /*
    while (parsedLevels.length < MAX_LEVELS) {
        parsedLevels.push(null);
    }

    if (parsedLevels.length > MAX_LEVELS) {
        parsedLevels.length = MAX_LEVELS;
    }
    */
    return parsedLevels;
}

// CLI Process
if (require.main === module) {
    const args = process.argv.slice(2).join(' ');

    if (!args) {
        console.log(help());
    } else {
        const parsedLevels = processFirst(args);
        const result = main(...parsedLevels);
        console.log(JSON.stringify(result, null, 2));
    }
}

module.exports = pathzer;