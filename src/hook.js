const decorate = require('./decorate');

function hookAttr(currentObj, key, decoration, thisArg = currentObj) {
    decoration = typeof decoration === 'function' ? decoration() : decoration;
    currentObj[key] = decorate(currentObj[key], decoration, thisArg);
    return currentObj;
}

function hookName(rootObj, name, decoration, thisArg) {
    const _root = rootObj;
    const keys = name.split('.');
    const targetKey = keys.pop();
    keys.forEach(ele => {
        rootObj = rootObj[ele];
    });
    hookAttr(rootObj, targetKey, decoration, thisArg);
    return _root;
}

function hookNames(rootObj, names, decoration, thisArg) {
    for (let name of names) {
        hookName(rootObj, name, decoration, thisArg);
    }
    return rootObj;
}

function hookMulti(rootObj, decorations, thisArg) {
    Object.entries(decorations).forEach(([key, decoration]) => {
        hookName(rootObj, key, decoration, thisArg);
    });
    return rootObj;
}

function hook(rootObj, arg1, arg2, arg3) {
    if (typeof arg1 === 'string') {
        return hookName(rootObj, arg1, arg2, arg3);
    } else if (arg1.constructor === Array) {
        return hookNames(rootObj, arg1, arg2, arg3);
    } else {
        return hookMulti(rootObj, arg1, arg2);
    }
}

module.exports = hook;