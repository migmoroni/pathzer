# TreeZer

Este programa é uma ferramenta para analisar árvores de diretórios e conteudo de arquivos.

Ele varre diretórios de forma recursiva, processa os arquivos encontrados, organiza as saídas de acordo com critérios definidos, analisa os dados com o uso de técnicas matemáticas de conjuntos e ao fim, permite exportar os resultados nos formatos: TREE, JSON, YAML, XML, Dirtree, Protobuf, Toml, S-Expressions, Thrift, CSV e OFX.

Permitindo tambem exportar em HTML, para uma análise visual dos dados.

## Funcionalidades

- Varredura recursiva de diretórios e conteudo de arquivos.
- Análise profunda dos dados.
- Mapa exportavel em mais de 10 formatos, com os resultados da análise.

## Como funciona

1. **Varredura de Diretórios/Arquivos**: O programa começa a partir de um diretório raiz fornecido e pode varrer todos os arquivos e subdiretórios de forma recursiva ou arquivos especificados.
2. **Mapeamento**: Os arquivos, juntamente de dados solicitados dos mesmos são armazenados.
3. **Filtro e Organização**: Com os dados, os arquivos podem ser organizados.
4. **Formatação e Exportação**: Os resultados podem ser formatados e exportados em mais de 10 padrões disponíveis.
5. **Analisar**: Por fim, você pode de forma bem mais focada analisar seus dados!

### Requisitos

- Node.js versão 18 ou superior.
- Gerenciador de pacotes `npm`

### Instalação

#### Via Clone

1. Clone este repositório:

```bash
git clone https://github.com/treezer/treezer.js.git
```

2. Navegue até o diretório do projeto:

```bash
cd treezer
```

3. Instale as dependências necessárias:

```bash
npm install
```

4. Execute:

```bash
node treezer
```

#### Via NPM

1. Baixe através do NPM:

```bash
npm install treezer
```

## Uso

### Via API

```js
treezer("?=home/user/projects", "ip=/b", "fp=/b", "ep=/html,2")
```

### Via interface de linha de comando

Apresentamos cada uma das funções existentes:

```bash
node treezer ?=home/user/projects ip=/b fp=/b ep=/html,2
```

### Como o sistema entende

opção: '?' , parametros: ['home/user/projects']
opção: 'ip', parametros: ['full']
opção: 'fp', parametros: ['0']
opção: 'ep', parametros: ['html','2']

## Comandos

| Comando   |  Função  |
|-----------|-----------|
|  [" i? "](#---obtenção-de-path-para-análise)   | Local de Importação |
|  [" ip "](#ip---importação-de-path)  | Importação de Path |
|  [" if "]()  | Importação de Arquivo |
|  [" fh "]()  | Filtro Hierarquico |
|  [" fc "]()  | Filtro Condicional |
|  [" fs "]()  | Filtro de Classificação |
|  [" ep "]()  | Exportação de Path |
|  [" e? "](#---obtenção-de-path-para-análise)   | Local de Exportação |

Visando simplificar o uso, tanto via CLI e via API, os comandos são unificados em um único padrão.

Exemplo de uso:

Via CLI
```bash
node treezer ?=home/user/projects
```

Via API
```js
treezer("?=home/user/projects")
```

Sendo assim, a seguir será demonstrado apenas os comandos, simplificando a explicação e uma vez que entenda, poderá utilizar em quaisquer das duas formas.

### "?" - Obtenção de Path para análise

- Path conhecido

```js
"?=home/user/projects"
```

- Path relativo

```js
"?"
```

### "ip" - Importação de Path

Forma simples*:

```js
"? ip"
```

*Importa com os valores padrões

#### `ip={fps},{textFile},{typeA},{filterFile},{typeB},{filterFolder}`

#### Opções e parâmetros:

#### {fps}: SuperParametro

##### f {formatter}: Insere caminho root no início do resultado

- **0** : Sem indicar o path root
- **1** : Apenas a pasta root
- **2** : Root completo, menos o usuário
- **3** : Root completo desde a raiz

##### p {perm}: Informa permissões dos arquivos

- **0** : Não informa
- **1** : Informa permissões de leitura e escrita

##### s {size}: Informa tamanho dos arquivos

- **0** : Não informa
- **1** : Tamanho em bytes (precisão máxima)
- **2** : Tamanho em KB (precisão máxima)
- **3** : Tamanho em MB (arredondado)
- **4** : Tamanho em MB (precisão máxima)
- **5** : Tamanho em bytes ou KB ou MB ou GB (arredondado)

##### MiniMacros:

- **0** : Zero em todos
- **1** : Formatação, sem info [2,0,0]
- **2** : Formatação, com apenas size em KB [2,0,2]
- **3** : Formatação, com apenas size em KB e perm [2,1,2]

##### Uso:

f = 2
p = 1
s = 2

```js
"? ip=[2,1,2],{textFile},{typeA},{filterFile},{typeB},{filterFolder}"
```

#### {textFile}: Informa texto interno dos documentos

- **0** : Não informa
- **\*** : Texto completo
- **1** : Informa a quantia de caracteres de texto
- **word1,word2,...** : Informa apenas as linhas que contêm as palavras informadas

##### Uso:

```js
"? ip={fps},0,{typeA},{filterFile},{typeB},{filterFolder}"

"? ip={fps},*,{typeA},{filterFile},{typeB},{filterFolder}"

"? ip={fps},[head,body],{typeA},{filterFile},{typeB},{filterFolder}"
```

#### {typeA} e {typeB}: Métodos de filtro

- **d__** : Exclui apenas os termos/arquivos/pastas informados
- **k__** : Mantém apenas os termos/arquivos/pastas informados

- **_i\*** : Por Item completo
- **_i1**  : Pelo item antes de "."
- **_i2**  : Pelo item após "."

##### Sobre os itens:

Caso seja nomes de arquivos:

- **_i\*** : Nome Completo
- **_i1**  : Nome do arquivo
- **_i2**  : Extensão do arquivo

Caso seja nome de pastas, se não tiverem pontos ".", tanto i*,i1 e i2 funcionarão.

Caso seja numeros:

- **_i\*** : Numero Completo
- **_i1**  : Parte inteira
- **_i2**  : Parte decimal

##### Uso:

```js
"? ip={fps},{textFile},di*,{filterFile},ki*,{filterFolder}"

"? ip={fps},{textFile},di2,{filterFile},di*,{filterFolder}"

"? ip={fps},{textFile},ki1,{filterFile},di2,{filterFolder}"
```

#### {filterFile}: Filtra itens dos arquivos informados

- **[item1,item2,...]** : Filtra os itens informados
- **[[item1,item2,...][item3,item4,...][...]]** : Filtra por grupos de arquivos informados (pelo nivel de tipos)
- **0** : Não filtrar

##### Uso:

```js
"? ip={fps},{textFile},{typeA},item1,{typeB},{filterFolder}"

"? ip={fps},{textFile},{typeA},[item1,item2],{typeB},{filterFolder}"

"? ip={fps},{textFile},{typeA},[[item1,item2][item3,item4]],{typeB},{filterFolder}"

"? ip={fps},{textFile},{typeA},0,{typeB},{filterFolder}"
```

#### {filterFolder}: Filtra pastas informadas

- **[folder1,folder2,...]** : Filtra as pastas informadas
- **[[folder1,folder2,...][folder3,folder4,...][...]]** : Filtra por grupos de pastas informadas (pelo nivel de tipos)
- **0** : Não filtrar

##### Uso:

```js
"? ip={fps},{textFile},{typeA},{filterFile},{typeB},folder1"

"? ip={fps},{textFile},{typeA},{filterFile},{typeB},[folder1,folder2]"

"? ip={fps},{textFile},{typeA},{filterFile},{typeB},[[folder1,folder2][folder3,folder4]]"

"? ip={fps},{textFile},{typeA},{filterFile},{typeB},0"
```

#### Relação dos tipos com os filtros

Utilizando conceitos matemáticos de conjuntos, a relação pode ser explicada assim:

1º Caso:

... [t1],[ex1,...] ...

[t1] age sobre [ex1,...]

2º Caso:

... [t1],[[ex1,...][ex2,...]] ...

[t1] age sobre [ex1,...] e [ex2,...]

3º Caso:

... [t1,t2],[[ex1,...][ex2,...]] ...

[t1] age sobre [ex1,...]
[t2] age sobre [ex2,...]

4º Caso:

... [t1,t2],[[ex1,...][ex2,...][ex3,...]] ...

[t1] age sobre [ex1,...]
[t2] age sobre [ex2,...]
[t1] e [t2] age sobre [ex3,...]


#### Macros

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
node treezer 'root'
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
node treezer 'root' -oe
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
node treezer 'root' -oe -fa
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