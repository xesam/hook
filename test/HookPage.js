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

    Page(option){
        Page(this.hooks.reduce((total, ele) => {
            return hook(total, ele);
        }, option));
    }
}

// function HookPage(option) {
//     this.hooks = [];
//     return Page(this.hooks.reduce((total, ele) => {
//         return hook(total, ele);
//     }, option));
// }
//
// HookPage.add = function (_hook) {
//     this.hooks.push(_hook);
// }

module.exports = HookPage;