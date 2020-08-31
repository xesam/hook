function _h(hooks) {
    return hooks;
}

function isFunction(f) {
    return typeof f === 'function';
}

function _function(target, hooks, thisArg) {
    if (!_h(hooks)) {
        return target;
    }
    return function _function0() {
        thisArg = thisArg || this;
        if (hooks.before) {
            hooks.before.call(thisArg, ...arguments);
        }
        try {
            if (target) {
                target.apply(this, arguments);
            }
        } catch (e) {
            if (hooks.afterThrow) {
                hooks.afterThrow.call(thisArg, e);
            } else {
                throw e;
            }
        } finally {
            if (hooks.after) {
                hooks.after.call(thisArg, ...arguments);
            }
        }
    }
}

function _object(target, hooks, thisArg) {
    if (!_h(hooks)) {
        return target;
    }
    Object.entries(hooks).forEach(([key, fn]) => {
        if (isFunction(fn)) {
            target[key] = _function(target[key], fn(), thisArg);
        }
    });
    return target;
}

function hook(target, hooks, thisArg) {
    if (isFunction(target)) {
        return _function(target, hooks, thisArg);
    } else {
        return _object(target, hooks, thisArg);
    }
}

function simple(target, names = [], hooks, thisArg) {
    if (!_h(hooks)) {
        return target;
    }
    names.forEach(ele => {
        target[ele] = _function(target[ele], hooks, thisArg);
    });
    return target;
}

function hookable(origin) {
    let wrapper = function () {
        origin(wrapper.hooks.reduce((total, ele) => {
            return hook(total, ele);
        }, ...arguments));
    };
    wrapper.hooks = [];
    wrapper.add = function () {
        this.hooks.push(...arguments);
        return this;
    };
    return wrapper;
}


hook.simple = simple;
hook.hookable = hookable;

module.exports = hook;