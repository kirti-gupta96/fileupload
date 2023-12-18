const uuidv4 = require('uuid').v4;

function createID(idprefix) {
    return idprefix + '-' +  uuidv4();
}

function IDGeneratorFactory (_prefix) {
    return createID(_prefix);
}

const idMap = {
    pictures: "pc",
    users: "u"
};

exports.generateId = function(modelName){
    return IDGeneratorFactory(idMap[modelName]);
}
