const decorate = require('./decorate');

function hookAttr(root, attr, decoration, context) {
    decoration = typeof decoration === 'function' ? decoration() : decoration;
    root[attr] = decorate(root[attr], decoration, context);
    return root;
}

function hookName(root, name, decoration, context) {
    const sepIndex = name.indexOf('.');
    if (sepIndex === -1) {
        hookAttr(root, name, decoration, context);
    } else {
        const childAttr = name.substring(0, sepIndex);
        root[childAttr] = hookName(root[childAttr] || {}, name.substring(sepIndex + 1), decoration, context);
    }
    return root;
}

function hookNames(root, names, decoration, context) {
    for (let name of names) {
        hookName(root, name, decoration, context);
    }
    return root;
}

function hookMulti(root, decorations, context) {
    Object.entries(decorations).forEach(([name, decoration]) => {
        hookName(root, name, decoration, context);
    });
    return root;
}

function hook(root, arg1, arg2, arg3) {
    if (typeof arg1 === 'string') {
        return hookName(root, arg1, arg2, arg3);
    } else if (arg1.constructor === Array) {
        return hookNames(root, arg1, arg2, arg3);
    } else {
        return hookMulti(root, arg1, arg2);
    }
}

module.exports = hook;