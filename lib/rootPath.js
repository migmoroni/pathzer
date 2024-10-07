const fs = require('fs');
const path = require('path');
let obs = []

function isValidPath(passedPath) {
    try {
        // Resolve o caminho para um formato absoluto
        const resolvedPath = path.resolve(passedPath);
        console.log(passedPath)
        
        // Verify
        if (!fs.existsSync(passedPath)) {
        info = 'Path not exist';
        return false;
        }

        // Is File or Folder?
        const stats = fs.lstatSync(passedPath);
        
        if (stats.isFile()) {
        info = 'Its a File Path';
        } else if (stats.isDirectory()) {
        info = 'Its a Folder Path';
        } else {
        info = 'Undefined Path';
        }
        
        return true;
    } catch (err) {
        console.error('Verify Path error:', err);
        return false;
    }
}

function rootPath(result, ...param){
    for (let i = 0; i < param.length; i++) {
        if ((!param[i].startsWith('/')) && (param[i] != "" )) {
            param[i] = '/' + param[i];
        }

        if (param[i] == (undefined || "")){
            result[i] = process.cwd();
            obs[i] = "Relative Path"
            continue
        } 

        if (isValidPath(param[i])){
            result[i] = param[i];
        } else {
            result[i] = null
        }
        
        obs[i] = info;

    };
    
    return [result, obs];
}


module.exports = rootPath;
