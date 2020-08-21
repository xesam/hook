const {is_hook} = require('./_h');
const hook_function = require('./hook_function');

function hook(target, hooks, thisArg) {
    if (!is_hook(hooks)) {
        return target;
    }
    Object.entries(hooks).forEach(([key, fn]) => {
        if (typeof fn === 'function') {
            const _hook = fn();
            target[key] = hook_function(target[key], _hook, thisArg || _hook);
        }
    });
    return target;
}

module.exports = hook;