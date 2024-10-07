


// Level 3 - Analyser Path
function executeLevel3(result, option, ...param) {
    switch (option) {
        case 'imp':
            result = imagePath(result, ...param);
            found = true;
            break;
        case 'dop':
            result = docPath(result, ...param);
            found = true;
            break;
        case 'mup':
            result = musicPath(result, ...param);
            found = true;
            break;
        case 'vip':
            result = videoPath(result, ...param);
            found = true;
            break;
        case 'prp':
            result = programPath(result, ...param);
            found = true;
            break;
        case 'lap':
            result = languagePath(result, ...param);
            found = true;
            break;
        default:
            (hierarchical == true) ? result = null : result;
    }
    return result;
}