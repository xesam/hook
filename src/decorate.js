function NOP(src, ...args) {
    return src(...args);
}

/**
 * _function(srcFn, function(src, ...args){}, context)
 * */
function _function(srcFn, decoration, context) {
    const $ = function () {
        if (!decoration) {
            decoration = NOP;
        }
        return decoration.call(context || this, srcFn, ...arguments);
    };
    $.decorate = function (decoration, context) {
        return decorate(this, decoration, context);
    };
    return $;
}

/**
 * _object(srcFn, {
 *   before:function(){},
 *   after:function(){},
 *   afterThrow:function(){}
 * }, context)
 * */
function _object(srcFn, decoration, context) {
    const objDecoration = function _object_ecoration(src, ...args) {
        if (decoration.before) {
            decoration.before.apply(this, args);
        }
        if (decoration.afterThrow) {
            try {
                let retObj = undefined;
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
    };
    return _function(srcFn, objDecoration, context);
}

function decorate(srcFn, decoration, context) {
    if (!decoration || typeof decoration === 'function') {
        return _function(srcFn, decoration, context);
    } else {
        return _object(srcFn, decoration, context);
    }
}

module.exports = decorate;