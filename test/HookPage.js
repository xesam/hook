const hook = require('../src/index').hook_obj;
const Page = require('./Page');

function HookPage(option) {
    const hooks = [
        {
            onLoad() {
                return {
                    before(page, query) {
                        console.log('this is before 1', query);
                    },
                    after(page, query) {
                        console.log('this is after 1', query);
                    },
                    afterThrow(e) {
                        console.log('afterThrow:', e.message);
                    }
                }
            }
        },
        {
            onLoad() {
                return {
                    before(page, query) {
                        console.log('this is before 2', query);
                    },
                    after(page, query) {
                        console.log('this is after 2', query);
                    },
                }
            }
        }
    ]
    return Page(hooks.reduce((total, ele) => {
        return hook(total, ele);
    }, option));
}

module.exports = HookPage;