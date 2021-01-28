const decorate = require('./decorate');
const hook = require('./hook');

function index() {
    const args = [...arguments];
    if (typeof args === 'function') {
        return decorate.apply(null, args);
    } else {
        return hook.apply(null, args);
    }
}

module.exports = index;