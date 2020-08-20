const hook = require('../src/index').hook_obj;

const obj = {
    data: {
        name: 'simple'
    },
    onLoad(query) {
        console.log('obj.onLoad, query=', query);
    },
    onShow() {
        console.log('obj.onShow, this.data=', this.data);
    }
};

const hooked2 = hook(obj, {
    id: 2,
    onLoad() {
        return {
            before() {
                console.log('onLoad before', this.id);
            },
            after() {
                console.log('onLoad after', this.id);
            }
        };
    },

    onShow() {
        return {
            before() {
                console.log('onShow before', this.id);
            },
            after() {
                console.log('onShow after', this.id);
            }
        };
    }
});

const hooked3 = hook(hooked2, {
    id: 3,
    onLoad() {
        return {
            before() {
                console.log('onLoad before', this.id);
            },
            after() {
                console.log('onLoad after', this.id);
            }
        };
    },

    onShow() {
        return {
            before() {
                console.log('onShow before', this.id);
            },
            after() {
                console.log('onShow after', this.id);
            }
        };
    }
});

hooked3.onLoad({id: '123'});
hooked3.onShow();