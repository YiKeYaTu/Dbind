const modelSettlement = {};
export function set(modelExtractId, key, func) {
    if(typeof func !== 'function')
        throw 'func参数需要是一个函数';
    if(!modelSettlement[modelExtractId]) {
        modelSettlement[modelExtractId] = {};
    }
    const target = modelSettlement[modelExtractId];
    if(target[key]) {
        target[key].push(func);
    } else {
        target[key] = [func];
    }
}
export function get(modelExtractId, key) {
    return (modelSettlement[modelExtractId] && modelSettlement[modelExtractId][key]) || null;
}
export function all(modelExtractId) {
    return modelSettlement[modelExtractId];
}
