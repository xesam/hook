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
        if (decoration.afterThrow) {
            try {
                let retObj = null;
                if (src) {
                    retObj = src.apply(this, args);
                }
                if (decoration.after) {
                    retObj = decoration.after.apply(this, [retObj].concat(args));
                }
                return retObj;
            } catch (e) {
                decoration.afterThrow.apply(this, [e].concat(args));
            }
        } else {
            let retObj = null;
            if (src) {
                retObj = src.apply(this, args);
            }
            if (decoration.after) {
                retObj = decoration.after.apply(this, [retObj].concat(args));
            }
            return retObj;
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