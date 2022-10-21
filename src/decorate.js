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
        let retObj = undefined;
        if (decoration.afterThrow) {
            try {
                if (src) {
                    retObj = src.apply(this, args);
                }
                if (decoration.afterReturn) {
                    retObj = decoration.afterReturn.apply(this, [retObj].concat(args));
                }
            } catch (e) {
                decoration.afterThrow.apply(this, [e].concat(args));
            }finally {
                if (decoration.after) {
                    retObj = decoration.after.apply(this, [retObj].concat(args));
                }
            }
            return retObj;
        } else {
            let retObj = null;
            if (src) {
                retObj = src.apply(this, args);
            }
            if (decoration.afterReturn) {
                retObj = decoration.afterReturn.apply(this, [retObj].concat(args));
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