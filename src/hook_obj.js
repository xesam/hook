const hook_function = require('./hook_function');

function hook(target, hooks, thisArg) {
    Object.entries(hooks).forEach(([key, fn]) => {
        if (typeof fn === 'function') {
            target[key] = hook_function(target[key], fn(), thisArg || hooks);
        }
    });
    return target;
}

module.exports = hook;