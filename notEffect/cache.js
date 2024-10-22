const fs = require('fs');
const path = require('path');
const os = require('os');

// Diretório de cache (variável dependendo do sistema operacional)
const cacheDir = path.join(os.homedir(), '.cache', 'my_program');
const cacheFilePath = path.join(cacheDir, 'cache.json');

// Função para inicializar o cache se não existir
function initializeCache() {
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
    }

    if (!fs.existsSync(cacheFilePath)) {
        fs.writeFileSync(cacheFilePath, JSON.stringify({}), 'utf8');
    }
}

// Função para carregar o cache
function loadCache() {
    initializeCache();
    const cacheData = fs.readFileSync(cacheFilePath, 'utf8');
    return JSON.parse(cacheData);
}

// Função para salvar no cache
function saveCache(data) {
    fs.writeFileSync(cacheFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// Função para verificar se o path já foi analisado hoje
function wasAnalyzedToday(cache, targetPath) {
    const today = new Date().toISOString().split('T')[0]; // Data no formato YYYY-MM-DD
    if (cache[targetPath] && cache[targetPath].date === today) {
        return cache[targetPath].tree; // Retorna a árvore salva
    }
    return null;
}

// Função para salvar a árvore no cache
function saveToCache(cache, targetPath, tree) {
    const today = new Date().toISOString().split('T')[0];
    cache[targetPath] = { date: today, tree: tree };
    saveCache(cache);
}

// Função principal que verifica o cache e executa a análise, se necessário
async function processPath(targetPath, performCheck, analyzeFunction) {
    const cache = loadCache();

    // Verifica se o path foi analisado hoje
    if (performCheck) {
        const cachedTree = wasAnalyzedToday(cache, targetPath);
        if (cachedTree) {
            console.log('Caminho já analisado hoje. Carregando do cache...');
            return cachedTree; // Retorna a árvore do cache se já foi analisado hoje
        }
    }

    // Chama a função de análise recursiva (que você já tem)
    console.log('Analisando o caminho...');
    const newTree = await analyzeFunction(targetPath);

    // Salva a árvore no cache
    saveToCache(cache, targetPath, newTree);
    return newTree;
}

// Função ao fim que salva todos os resultados (opcional, se houver necessidade de persistir algo ao final)
function saveFinalResults(tree) {
    const cache = loadCache();
    const targetPath = 'final_results'; // Define um path de cache genérico para resultados finais
    saveToCache(cache, targetPath, tree);
}

// Função de exemplo que simula a análise recursiva (substitua pela sua função)
async function analyzeRecursiveFunction(targetPath) {
    // Simula uma função que retorna a estrutura da árvore
    return [
        ["books", "Memorias-Postumas-de-Bras-Cubas.txt", "Dom-Quixote.txt"],
        ["books", "Der-prozess.odt"],
        ["countries", "europe", "Switzerland.txt"],
        ["countries", "asia", "China.txt"],
        ["countries", "southamerica", "Brazil.txt"],
        ["countries", "northamerica", "UnitedStates.txt"],
        ["Readme.md"],
        ["Info.txt"]
    ];
}

// Exemplo de uso
async function run() {
    const targetPath = '/my/folder/path'; // Define o path a ser analisado
    const performCheck = true; // Verifica o cache antes de executar a análise

    // Processa o path (carrega do cache se já foi analisado hoje)
    const tree = await processPath(targetPath, performCheck, analyzeRecursiveFunction);

    // Aqui você pode chamar suas funções para gerar e salvar o arquivo (JSON, YAML, etc)
    console.log('Árvore final:', tree);

    // Ao final, salva resultados se necessário
    saveFinalResults(tree);
}

run();
