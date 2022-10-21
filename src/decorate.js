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
    $.decorate = function (otherDecoration, otherContext) {
        return decorate(this, otherDecoration, otherContext);
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
        let foundSrcError = false;
        let theSrcError = null;
        try {
            if (src) {
                theReturn = src.apply(this, args);
            }
        } catch (e) {
            foundSrcError = true;
            theSrcError = e;
        }
        if (foundSrcError) {
            if (decoration.afterThrow) {
                const interrupted = decoration.afterThrow.apply(this, [theSrcError].concat(args));
                if (typeof interrupted !== 'boolean') {
                    console.warn('you should return a boolean');
                }
                if (!interrupted) {
                    throw theSrcError;
                }
            } else {
                throw theSrcError;
            }
        } else {
            if (decoration.afterReturn) {
                theReturn = decoration.afterReturn.apply(this, [theReturn].concat(args));
            }
        }

        if (decoration.after) {
            decoration.after.apply(this, [theReturn, theSrcError].concat(args));
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