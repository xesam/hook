const _function = require('./decorate');
const _object = require('./hook.object');

function hook() {
    const args = [...arguments];
    if (typeof args === 'function') {
        return _function.apply(null, args);
    } else {
        return _object.apply(null, args);
    }
}

module.exports = hook;