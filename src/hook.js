const decorate = require('./decorate');

/**
 * hookAttr(root, 'say', decoration, context)
 * */
function hookAttr(root, attr, decoration, context) {
    decoration = typeof decoration === 'function' ? decoration() : decoration;
    root[attr] = decorate(root[attr], decoration, context);
    return root;
}

/**
 * hookName('.', root, 'methods.a.b.c.d.e', decoration, context)
 * hookName('.', root, 'say', decoration, context)
 * */
function hookName(sep, root, name, decoration, context) {
    const sepIndex = name.indexOf(sep);
    if (sepIndex === -1) {
        hookAttr(root, name, decoration, context);
    } else {
        const childAttr = name.substring(0, sepIndex);
        const childRoot = root[childAttr] || {};
        root[childAttr] = hookName(sep, childRoot, name.substring(sepIndex + 1), decoration, context);
    }
    return root;
}

function hookNames(handle, root, names, decoration, context) {
    for (let name of names) {
        handle(root, name, decoration, context);
    }
    return root;
}

function hookMulti(handle, root, decorations, context) {
    Object.entries(decorations).forEach(([name, decoration]) => {
        handle(root, name, decoration, context);
    });
    return root;
}

function createHookName(sep) {
    return function $hookName() {
        return hookName(sep, ...arguments)
    }
}

function create(sep = '.') {
    const handle = createHookName(sep);

    function $(root, name, arg2, arg3) {
        if (typeof name === 'string') {
            return handle(root, name, arg2, arg3);
        } else if (name.constructor === Array) {
            return hookNames(handle, root, name, arg2, arg3);
        } else {
            return hookMulti(handle, root, name, arg2);
        }
    }

    $.create = create;
    return $;
}

const hook = create();

module.exports = hook;