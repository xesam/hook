const hook = require('../src/index').hook_obj;
const Page = require('./Page');

class HookPage {
    constructor() {
        this.hooks = [];
    }

    add(hk) {
        this.hooks.push(hk);
        return this;
    }

    Page(option) {
        Page(this.hooks.reduce((total, ele) => {
            return hook(total, ele);
        }, option));
    }
}

module.exports = HookPage;