

let pathMode = 2; //padrão
if (args.length === 0){
  
  showHelp();
}

//console.log(args)

// Verifica os argumentos
try {
args.forEach(arg => {
  
  switch (arg) {
    //Comandos para Path
    case "0":
      console.log("Local pathMode")
      pathMode = 0;
      break;

    case "1":
      console.log("Personal pathMode")
      pathMode = 1;
      break;

    case "2":
      console.log("Standard pathMode")
      pathMode = 2;
      break;

    //Comandos para Compressão
    case '-a':
      if (pathMode == 2){
        pathBase = 'files/src'
      }

      readPath(pathBase).then(result => {
        result = orgPath(result);
        //console.log("Resultado final:", result);
        result.forEach((line) => {
          let {path, folders, files} = filterPath(line);
          analyse(path, folders, files);
        });

      }).catch(error => {
          console.error("Erro ao ler os arquivos:", error);
      });
      

      break;

    case '-b':
      if (pathMode == 2){
        pathBase = 'files/builder/base'
      }
      
      readPath(pathBase).then(result => {
        result = orgPath(result);
        console.log("Resultado final:", result);
        result.forEach((line) => {
          let {path, folders, files} = filterPath(line);
          console.log(path, folders, files)
          build(path, folders, files);
        });

      }).catch(error => {
          console.error("Erro ao ler os arquivos:", error);
      });

      break;

    case '-c':
      case '-c-d':
        if (pathMode == 2){
          pathBase = 'files/src'
        }

        readPath(pathBase).then(result => {
          result = orgPath(result);
          //console.log("Resultado final:", result);
          result.forEach((line) => {
            let {path, folders, files} = filterPath(line);
            codeFile(path, folders, files);
          });

        }).catch(error => {
            console.error("Erro ao ler os arquivos:", error);
        });


        //const filesC = fs.readdirSync('./files/src');
        //filesC.forEach(file => codeFile(file));

        break;
    
    case '-c-m':
      if (pathMode == 2){
        pathBase = 'files/src'
      }

      // Chamando getRootFiles e passando o processFile como parâmetro
      pathzer(pathBase, 1, minifier);

      /*
      pathzer('r', pathBase).then(result => {
        console.log("Resultado final:", result);
        result = pathzer('o', result);
        
        result.forEach((line) => {
          let {path, folders, files} = pathzer('f', line);
          minifier(path, folders, files);
        });

      }).catch(error => {
          console.error("Erro ao ler os arquivos:", error);
      });
      console.log("mini")
      */
      /*
      readPath(pathBase).then(result => {
        console.log("Resultado final:", result);
        result = orgPath(result);
        
        result.forEach((line) => {
          let {path, folders, files} = filterPath(line);
          minifier(path, folders, files);
        });

      }).catch(error => {
          console.error("Erro ao ler os arquivos:", error);
      });
      console.log("mini")
      */
      //const filesCMini = fs.readdirSync('./files/src');
      //filesCMini.forEach(file => minifier(file));

      break;

    case '-d':
      case '-d-d':
        if (pathMode == 2){
          pathBase = 'files/coder/com'
        }

        readPath(pathBase).then(result => {
          result = orgPath(result);
          //console.log("Resultado final:", result);
          result.forEach((line) => {
            let {path, folders, files} = filterPath(line);
            unCodeFile(path, folders, files);
          });

        }).catch(error => {
            console.error("Erro ao ler os arquivos:", error);
        });
        
        //const filesD = fs.readdirSync('./files/coder/com');
        //filesD.forEach(file => unCodeFile(file));

        break;
    case '-d':
      case '-d-m':
        if (pathMode == 2){
          pathBase = 'files/coder/com'
        }

        readPath(pathBase).then(result => {
          result = orgPath(result);
          //console.log("Resultado final:", result);
          result.forEach((line) => {
            let {path, folders, files} = filterPath(line);
            deMinifier(path, folders, files);
          });

        }).catch(error => {
            console.error("Erro ao ler os arquivos:", error);
        });
        
        //const filesD = fs.readdirSync('./files/coder/com');
        //filesD.forEach(file => unCodeFile(file));

        break;
    
    case '-r':
      case '--remove':
        if (pathMode == 2){
          pathBase = ['./files/coder/com', './files/coder/decode'];
        }

        //const folderPath = ['./files/coder/com', './files/coder/decode'];
        cleanPath(pathBase);

        break;

    case '-h':
      case '--help':
        showHelp();

        break;

    case '-v':
      case '--version':
        console.log(`compresscode version: 0.1.0`);

        break;

    default:
      console.log(`Not know: ${arg}`);
      showHelp();

      break;
  }

})

} catch (err) {
  console.error("Erro ao ler o diretório ou processar arquivos:", err);
}