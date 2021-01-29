function NOP(src, ...args) {
    return src(...args);
}

function _function(srcFn, decoration = NOP, thisArg) {
    const $ = function () {
        return decoration.call(thisArg || this, srcFn, ...arguments);
    };
    $.decorate = function (decoration, thisArg) {
        return decorate(this, decoration, thisArg);
    };
    return $;
}

function _object(srcFn, decoration, thisArg) {
    return _function(srcFn, function (srcFn, ...args) {
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
        return _function(srcFn, decoration, thisArg);
    } else {
        return _object(srcFn, decoration, thisArg);
    }
}

module.exports = decorate;