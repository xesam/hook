const hook = require('../src/index').hook_function;

function fn(nickname, address) {
    console.log(`this is fn, this.name=${this.name},`, `${nickname},${address}`);
}

const obj = {
    name: 'obj_name'
};

const hooked = hook(fn, {
    before() {
        console.log('this is before');
    },
    after() {
        console.log('this is after');
    },
    afterThrow(e) {
        console.error(e);
    }
});
obj.fn = hooked;
hooked();
obj.fn('atm', 'M78');