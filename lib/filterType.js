function filterDeletePath(type, item, list){
    if (type === 'n') {
        const fileName = item.split('.')[0];
        if (!list.includes(fileName)) {
            return item;
        }
        else {
            console.log(`Skipping: ${item}`);
        }
    }
    else if (type === 'e') {
        const fileExtension = item.split('.').pop();
        if (!list.includes(fileExtension)) {
            return item;
        }
        else {
            console.log(`Skipping: ${item}`);
        }
    }
    else{
        return item;
    }
}

function filterKeepPath(type, item, list){
    if (type === 'n') {
        const fileName = item.split('.')[0];
        if (list.includes(fileName)) {
            return item;
        }
        else {
            console.log(`Skipping: ${item}`);
        }
    }
    else if (type === 'e') {
        const fileExtension = item.split('.').pop();
        if (list.includes(fileExtension)) {
            return item;
        }
        else {
            console.log(`Skipping: ${item}`);
        }
    }
    else{
        return item;
    }
}

function filterDeleteNumber(type, item, list){
    if (type === 'i') {
        const fileName = item.split('.')[0];
        if (!list.includes(fileName)) {
            return item;
        }
    }
    else if (type === 'f') {
        const fileExtension = item.split('.').pop();
        if (!list.includes(fileExtension)) {
            return item;
        }
    }
    else{
        return item;
    }
}

function filterKeepNumber(type, item, list){
    if (type === 'i') {
        const fileName = item.split('.')[0];
        if (list.includes(fileName)) {
            return item;
        }
    }
    else if (type === 'f') {
        const fileExtension = item.split('.').pop();
        if (list.includes(fileExtension)) {
            return item;
        }
    }
    else{
        return item;
    }
}


function filterType(type, item, list){

    if (!(list === "")){
        if (type.startsWith("p")){
            type = type.slice(1);
            if (type.startsWith("d")){
                return filterDeletePath(type.slice(1), item, list);
            } else if (type.startsWith("k")){
                return filterKeepPath(type.slice(1), item, list);
            } else {
                return item;
            }
        } else if (type.startsWith("n")){
            type = type.slice(1);
            if (type.startsWith("d")){
                return filterDeleteNumber(type.slice(1), item, list);
            } else if (type.startsWith("k")){
                return filterKeepNumber(type.slice(1), item, list);
            } else {
                return item;
            }
        } else {
            return item;
        }
    } else {
        return item;
    }
    
}


module.exports = filterType;