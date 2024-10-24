function filterDelete(type, item, list){
    if (type === 'i*') {
        const fileName = item;
        if (!list.includes(fileName)) {
            return item;
        }
        else {
            console.log(`Skipping: ${item}`);
        }
    }
    else if (type === 'i1') {
        const fileName = item.split('.')[0];
        if (!list.includes(fileName)) {
            return item;
        }
        else {
            console.log(`Skipping: ${item}`);
        }
    }
    else if (type === 'i2') {
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

function filterKeep(type, item, list){
    if (type === 'i*') {
        const fileName = item;
        if (list.includes(fileName)) {
            return item;
        }
        else {
            console.log(`Skipping: ${item}`);
        }
    }
    else if (type === 'i1') {
        const fileName = item.split('.')[0];
        if (list.includes(fileName)) {
            return item;
        }
        else {
            console.log(`Skipping: ${item}`);
        }
    }
    else if (type === 'i2') {
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


function filterType(type, item, list){
    
    if (!(list === "")){
        if (type.startsWith("d")){
            return filterDelete(type.slice(1), item, list);
        } else if (type.startsWith("k")){
            return filterKeep(type.slice(1), item, list);
        } else {
            return item;
        }
    } else {
        return item;
    }
    
}


module.exports = filterType;