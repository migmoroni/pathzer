# File Processor

Este programa é uma ferramenta em Node.js para processar arquivos e diretórios. Ele varre diretórios de forma recursiva, processa os arquivos encontrados, e organiza as saídas de acordo com critérios definidos, como agrupamento por extensões de arquivos.

## Funcionalidades

- Varredura recursiva de diretórios e arquivos.
- Organização dos arquivos por extensão.
- Preserva a estrutura de diretórios ao processar.
- Ignora diretórios e processa apenas arquivos.
- Possibilidade de manipulação posterior dos dados organizados.

## Como funciona

1. **Varredura de Arquivos**: O programa começa a partir de um diretório raiz fornecido e varre todos os arquivos e subdiretórios de forma recursiva.
2. **Mapeamento**: As pastas e arquivos são lidos, e seus caminhos são armazenados.
3. **Filtro e Organização**: Com seus caminhos, os arquivos podem ser organizados.
4. **Formatação e Exportação**: Os resultados podem ser formatados e exportados em 10 padrões disponíveis.
5. **Analisar**: Por fim, você pode de forma bem mais focada analisar seus documentos!

### Requisitos

- Node.js versão 18 ou superior.
- Gerenciador de pacotes `npm`

### Instalação

#### Via Clone

1. Clone este repositório:

```bash
git clone https://github.com/migmoroni/pathzer.js.git
```

2. Navegue até o diretório do projeto:

```bash
cd pathzer
```

3. Instale as dependências necessárias:

```bash
npm install
```

4. Execute:

```bash
node pathzer
```

#### Via NPM

1. Baixe através do NPM:

```bash
npm install pathzer
```

## Uso

### Via API

```js
pathzer("?=home/user/projects", "rp=/b", "fp=/b", "ep=/html,2")
```

### Via interface de linha de comando

Apresentamos cada uma das funções existentes:

```bash
node pathzer ?=home/user/projects rp=/b fp=/b ep=/html,2
```

### Como o sistema entende

opção: '?' , parametros: ['home/user/projects']
opção: 'rp', parametros: ['full']
opção: 'fp', parametros: ['0']
opção: 'ep', parametros: ['html','2']

## Comandos

### Obtenção de Path para análise

- Path conhecido

CLI
```bash
node pathzer ?=home/user/projects
```
API
```js
pathzer("?=home/user/projects")
```

- Path relativo

CLI
```bash
node pathzer ?
```
API
```js
pathzer("?")
```

### Leitura do Path

Formas simples:

CLI
```bash
node pathzer ? rp
```
API
```js
pathzer("?", "rp")
```

* Se não informar previamente, por padrão, é fornecido o caminho relativo, ou seja, a escolha "?".

#### `rp={formatter},{perm},{size},{textFile},{filterFolder},{filterFile}`

### Opções e parâmetros:

### {formatter}: Insere caminho root no início do resultado

- **0** : Sem indicar o path root
- **1** : Apenas a pasta root
- **2** : Root completo, menos o usuário
- **3** : Root completo desde a raiz

### {perm}: Informa permissões dos arquivos

- **0** : Não informa
- **1** : Informa permissões de leitura e escrita

### {size}: Informa tamanho dos arquivos

- **0** : Não informa
- **1** : Tamanho em bytes (precisão máxima)
- **2** : Tamanho em KB (precisão máxima)
- **3** : Tamanho em MB (arredondado)
- **4** : Tamanho em MB (precisão máxima)
- **5** : Tamanho em bytes ou KB ou MB ou GB (arredondado)

### {textFile}: Informa texto interno dos documentos

- **0** : Não informa
- **\*** : Texto completo
- **1** : Informa a quantia de caracteres de texto
- **word1,word2,...** : Informa apenas as linhas que contêm as palavras informadas

### {filterFolder}: Filtra pastas informadas

- **folder1,folder2,...** : Filtra as pastas informadas

### {filterFile}: Filtra os arquivos informados

- **file1,file2,...** : Filtra as pastas informadas

### Macros

Em todas as opções, já existem macros com implementações de parametros por padrão, para diversos usos mais corriqueiros.

/dev => Para desenvolvedores
/src => Para buscas simples de pastas e arquivos

## Exemplo de Processamento

```
root/
├── books/
│   ├── Memorias-Postumas-de-Bras-Cubas.txt
│   ├── Dom-Quixote.txt
│   └── Der-prozess.odt
├── countries/
│   └── Switzerland.txt
├── Readme.md
└── Info.txt
```
### Saidas

```bash
node pathzer 'root'
```

[
    ["books", "Memorias-Postumas-de-Bras-Cubas.txt", "Dom-Quixote.txt", "Der-prozess.odt"],
    ["countries", "europe", "Switzerland.txt"],
    ["countries", "asia", "China.txt"],
    ["countries", "southamerica", "Brazil.txt"],
    ["countries", "northamerica", "UnitedStates.txt"],
    ["Readme.md", "Info.txt"]
]

```bash
node pathzer 'root' -oe
```

[
    ["books", "Memorias-Postumas-de-Bras-Cubas.txt", "Dom-Quixote.txt"],
    ["books", "Der-prozess.odt"],
    ["countries", "europe", "Switzerland.txt"],
    ["countries", "asia", "China.txt"],
    ["countries", "southamerica", "Brazil.txt"],
    ["countries", "northamerica", "UnitedStates.txt"],
    ["Readme.md"],
    ["Info.txt"]
]

```bash
node pathzer 'root' -oe -fa
```

[
    'books'
    ["books", "Memorias-Postumas-de-Bras-Cubas.txt", "Dom-Quixote.txt"],
    ["books", "Der-prozess.odt"],
    ["countries", "europe", "Switzerland.txt"],
    ["countries", "asia", "China.txt"],
    ["countries", "southamerica", "Brazil.txt"],
    ["countries", "northamerica", "UnitedStates.txt"],
    ["Readme.md"],
    ["Info.txt"]
]

["Readme.md","index2.html","language",["english",["en.txt"],"es-1.json","index.html","index.js","output.css","portuguese",["pt.txt"],"test.html"],"text",["text.txt"]]

[
    ["Readme.md"],
    ["index2.html"],
    ["language", ["es-1.json"]],
    ["language", ["index.html","test.html"]],
    ["language", ["index.js"]],
    ["language", ["output.css"]],
    ["language", ["english",["en.txt"]]],
    ["language", ["english",["en.xml"]]],
    ["language", ["portuguese",["pt.txt"]]]
    ["text", ["text.txt"]]
]


["Readme.md","index2.html","language",["es-1.json","index.html","index.js","output.css","test.html","english",["en.txt","en.xml"],"portuguese",["pt.txt"]],"text",["text.txt"]]