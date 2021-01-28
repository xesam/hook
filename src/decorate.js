function NOP(src) {
    return src();
}

function _decorate(srcFn, decoration = NOP, thisArg) {
    return function $() {
        return decoration.apply(thisArg, [srcFn, ...arguments]);
    };
}

function _simple(srcFn, decoration, thisArg) {
    let _$ = _decorate(srcFn, function (srcFn) {
        if (decoration.before) {
            decoration.before.apply(this, arguments);
        }
        try {
            if (srcFn) {
                srcFn.apply(this, arguments);
            }
        } catch (e) {
            if (decoration.afterThrow) {
                decoration.afterThrow.call(this, e.message, arguments);
            } else {
                throw e;
            }
        } finally {
            if (decoration.after) {
                decoration.after.apply(this, arguments);
            }
        }
    }, thisArg);
    let _src_ = srcFn._src_ ? srcFn._src_ : [srcFn.name];
    _src_.push(decoration.name ? decoration.name : srcFn.name);
    _$._src_ = _src_;
    _$.decorate = function (decoration, thisArg) {
        return _simple(this, decoration, thisArg);
    };
    return _$;
}

function decorate(srcFn, decoration, thisArg) {
    if (!decoration || typeof decoration === 'function') {
        return _decorate(srcFn, decoration, thisArg);
    } else {
        return _simple(srcFn, decoration, thisArg);
    }
}

module.exports = decorate;

if (!module.parent) {

    function src(a, b) {
        console.log(a, b);
        return a + b;
    }

    function error() {
        return d;
    }

    const hook1 = _decorate(src, {
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
    hook2 = hook1.decorate({
        before(a, b) {
            console.log('before2', a, b);
        },
        after(a, b) {
            console.log('after2', a, b);
        },
        afterThrow(e, args) {
            console.log('afterThrow2', e, args);
        }
    })
    // hook2(100, 200);
    console.log(hook1._src_);
    console.log(hook2._src_);
}
