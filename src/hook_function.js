function hook(fn, hooks, thisArg) {
    return function _hook() {
        if (hooks.before) {
            hooks.before.call(thisArg || this, this, ...arguments);
        }
        try {
            fn.apply(this, arguments);
        } catch (e) {
            if (hooks.afterThrow) {
                hooks.afterThrow.call(thisArg || this, e, ...arguments);
            } else {
                throw e;
            }
        } finally {
            if (hooks.after) {
                hooks.after.call(thisArg || this, this, ...arguments);
            }
        }
    }
}

module.exports = hook;