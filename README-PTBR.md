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
3. **Organização**: Com seus caminhos, os arquivos podem ser organizados.
4. **Formatação**: Ao fim, os resultados podem ser formatados e exportados nos 8 padrões disponíveis.

### Requisitos

- Node.js versão 18 ou superior.
- Gerenciador de pacotes `npm`

### Instalação

#### Via Clone

1. Clone este repositório:
    ```bash
    git clone https://github.com/migmoroni/pathzer.git
    ```
2. Navegue até o diretório do projeto:
    ```bash
    cd seu-repositorio
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



### Via interface de linha de comando

Para executar o programa, use o seguinte comando no terminal, passando o caminho do diretório que deseja processar:

```bash
node pathzer 'path' 
```



### Exemplo de Processamento

root/
├── books/
│   ├── Memorias-Postumas-de-Bras-Cubas.txt
│   ├── Dom-Quixote.txt
│   └── Der-prozess.odt
├── countries/
│   └── Switzerland.txt
├── Readme.md
└── Info.txt

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