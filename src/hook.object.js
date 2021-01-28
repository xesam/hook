const _function = require('./decorate');

function _objAttr(currentObj, key, decoration, thisArg) {
    decoration = typeof decoration === 'function' ? decoration() : decoration;
    currentObj[key] = _function(currentObj[key], decoration, thisArg);
    return currentObj;
}

function _objKey(rootObj, key, decoration, thisArg) {
    const _root = rootObj;
    const keys = key.split('.');
    const targetKey = keys.pop();
    keys.forEach(ele => {
        rootObj = rootObj[ele];
    });
    _objAttr(rootObj, targetKey, decoration, thisArg);
    return _root;
}

function _objKeys(srcObj, names, decoration, thisArg) {
    for (let name of names) {
        _objKey(srcObj, name, decoration, thisArg);
    }
    return srcObj;
}

function _objAttrs(srcObj, decorations, thisArg) {
    Object.entries(decorations).forEach(([key, decoration]) => {
        _objKey(srcObj, key, decoration, thisArg);
    });
    return srcObj;
}

function _object(srcObj, name, decoration, thisArg) {
    if (typeof name === 'string') {
        return _objKey(srcObj, name, decoration, thisArg);
    } else if (name.constructor === Array) {
        return _objKeys(srcObj, name, decoration, thisArg);
    } else {
        return _objAttrs(srcObj, name, decoration);
    }
}

module.exports = _object;

if (!module.parent) {
    const obj = {
        fn(a, b) {
            console.log('obj.fn', a, b);
        },
        son: {
            age: 18,
            hello(a, b) {
                console.log('obj.son.hello', a, b);
            }
        }
    };

    const hook1 = _objAttr({
            fn(a, b) {
                console.log('obj.fn', a, b);
            }
        },
        'fn',
        {
            name: 'decoration1',
            before(a, b) {
                console.log('before', a, b);
            },
            after(a, b) {
                console.log('after', a, b);
            },
            afterThrow(e, args) {
                console.log('afterThrow', e, args);
            }
        });
    // hook1.fn(100, 200);

    const hook2 = _objAttr({
            son: {
                hello(a, b) {
                    console.log('obj.son.hello', a, b);
                }
            }
        },
        'son.hello',
        {
            name: 'decoration1',
            before(a, b) {
                console.log('before', a, b);
            },
            after(a, b) {
                console.log('after', a, b);
            },
            afterThrow(e, args) {
                console.log('afterThrow', e, args);
            }
        });
    // hook2.son.hello(300, 400);

    const hook3 = _objKeys({
            fn(a, b) {
                console.log('obj.fn', a, b);
            },
            son: {
                hello(a, b) {
                    console.log('obj.son.hello', a, b);
                }
            }
        },
        ['fn', 'son.hello'],
        {
            name: 'decoration1',
            before(a, b) {
                console.log('before', a, b);
            },
            after(a, b) {
                console.log('after', a, b);
            },
            afterThrow(e, args) {
                console.log('afterThrow', e, args);
            }
        });
    // hook3.fn(100, 200);
    // hook3.son.hello(300, 400);

    const hook4 = _objAttrs(
        {
            onLoad() {
                console.log('onLoad', ...arguments);
            },
            onShow() {
                console.log('onShow', ...arguments);
            }
        },
        {
            onLoad() {
                return {
                    before() {
                        console.log('onLoad before');
                    },
                    after() {
                        console.log('onLoad after');
                    }
                }
            },
            onShow() {
                return {
                    before() {
                        console.log('onShow before');
                    },
                    after() {
                        console.log('onShow after');
                    }
                }
            }
        }
    );
    hook4.onLoad();
    hook4.onShow();
}