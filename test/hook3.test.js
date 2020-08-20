const hook = require('../src/index').hook_obj_names;
const Page = require('./Page')
const option = {
    data: {
        name: 'xpy'
    },
    onLoad(query) {
        console.log('onLoad', query);
    },
    onShow() {
        console.log('onShow', this.data);
    },
    onUnload() {
        console.log('onUnload');
    },
};

Page(option);

console.log('-----------------------------------');

const opt2 = hook(option, ['onLoad', 'onShow', 'onUnload'], {
    before() {
        console.log('this is before 1');
    },
    after() {
        console.log('this is after1 ');
    }
});

const opt3 = hook(opt2, ['onLoad', 'onShow', 'onUnload'], {
    before() {
        console.log('this is before 2');
    },
    after() {
        console.log('this is after 2');
    }
});
Page(opt3);