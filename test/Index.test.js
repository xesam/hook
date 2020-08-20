const HookPage = require('./HookPage');

HookPage({
    onLoad(query) {
        console.log('onLoad', query);
        const a = null.length;
        console.log(a);
    },

    onShow() {
        console.log('onShow');
    },

    onUnload() {
        console.log('onUnload');
    }
});