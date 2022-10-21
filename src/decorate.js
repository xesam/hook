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
 *   afterReturn:function(){},
 *   afterThrow:function(){},
 *   after:function(){}
 * }, context)
 * */
function _object(srcFn, decoration, context) {
    const objDecoration = function _object_ecoration(src, ...args) {
        if (decoration.before) {
            decoration.before.apply(this, args);
        }
        let theReturn = undefined;
        if (decoration.afterThrow) {
            try {
                if (src) {
                    theReturn = src.apply(this, args);
                }
                if (decoration.afterReturn) {
                    theReturn = decoration.afterReturn.apply(this, [theReturn].concat(args));
                }
            } catch (e) {
                decoration.afterThrow.apply(this, [e].concat(args));
            } finally {
                if (decoration.after) {
                    theReturn = decoration.after.apply(this, [theReturn].concat(args));
                }
            }
            return theReturn;
        } else {
            if (src) {
                theReturn = src.apply(this, args);
            }
            if (decoration.afterReturn) {
                theReturn = decoration.afterReturn.apply(this, [theReturn].concat(args));
            }
            if (decoration.after) {
                theReturn = decoration.after.apply(this, [theReturn].concat(args));
            }
        }
        return theReturn;
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