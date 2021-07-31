function NOP(src, ...args) {
    return src(...args);
}

function _function(srcFn, decoration = NOP, context) {
    const $ = function () {
        return decoration.call(context || this, srcFn, ...arguments);
    };
    $.decorate = function (decoration, context) {
        return decorate(this, decoration, context);
    };
    return $;
}

function _object(srcFn, decoration, context) {
    return _function(srcFn, function (src, ...args) {
        if (decoration.before) {
            decoration.before.apply(this, args);
        }
        let err = false;
        try {
            if (src) {
                src.apply(this, args);
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
    }, context);
}

function decorate(srcFn, decoration, context) {
    if (!decoration || typeof decoration === 'function') {
        return _function(srcFn, decoration, context);
    } else {
        return _object(srcFn, decoration, context);
    }
}

module.exports = decorate;