const decorate = require('./decorate');

/**
 * hookAttr(root, 'say', decoration, context)
 * */
function hookAttr(root, attr, decoration, context) {
    if (typeof decoration === 'function') {
        decoration = decoration.call(context || root, root);
    }
    if (decoration) {
        root[attr] = decorate(root[attr], decoration, context);
    }
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

/**
 * hookNames('.', root, ['a','b','c.d','methods.a.b.c.d.e'], decoration, context)
 * */
function hookNames(handle, root, names, decoration, context) {
    for (const name of names) {
        handle(root, name, decoration, context);
    }
    return root;
}

/**
 * hookWithCompoundDecoration('.', root, {
 *  'a':{ before:function(){}, after:function(){}}
 *  'b':{ before:function(){}, after:function(){}}
 *  'c.d':{ before:function(){}, after:function(){}}
 *  'methods.a.b.c.d.e':{ before:function(){}, after:function(){}}
 * }, context)
 * */
function hookWithNamedDecoration(handle, root, namedDecoration, context) {
    Object.entries(namedDecoration).forEach(([name, decoration]) => {
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
        } else if (Array.isArray(name)) {
            return hookNames(handle, root, name, arg2, arg3);
        } else {
            return hookWithNamedDecoration(handle, root, name, arg2);
        }
    }

    $.create = create;
    return $;
}

const hook = create();

module.exports = hook;