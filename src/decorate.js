function NOP(src) {
    return src();
}

function _decorate(srcFn, decoration = NOP, thisArg) {
    const $ = function () {
        return decoration.apply(thisArg || srcFn, [srcFn, ...arguments]);
    };
    let _src_ = srcFn._src_ ? srcFn._src_ : [srcFn.name];
    _src_.push(decoration.name ? decoration.name : srcFn.name);
    $._src_ = _src_;
    $.decorate = function (decoration, thisArg) {
        return decorate(this, decoration, thisArg);
    };
    return $;
}

function _simple(srcFn, decoration, thisArg) {
    return _decorate(srcFn, function () {
        const [srcFn, ...args] = arguments;
        if (decoration.before) {
            decoration.before.apply(this, args);
        }
        let err = false;
        try {
            if (srcFn) {
                srcFn.apply(this, args);
            }
        } catch (e) {
            err = true;
            if (decoration.afterThrow) {
                decoration.afterThrow.call(this, e.message, args);
            } else {
                throw e;
            }
        }
        if (!err) {
            if (decoration.after) {
                decoration.after.apply(this, args);
            }
        }
    }, thisArg);
}

function decorate(srcFn, decoration, thisArg) {
    if (!decoration || typeof decoration === 'function') {
        return _decorate(srcFn, decoration, thisArg);
    } else {
        return _simple(srcFn, decoration, thisArg);
    }
}

module.exports = decorate;