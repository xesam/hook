const hook_function = require('./hook_function');

function hook_obj_names(target, names = [], hooks, thisArg) {
    names.forEach(ele => {
        target[ele] = hook_function(target[ele], hooks, thisArg);
    });
    return target;
}

module.exports = hook_obj_names;