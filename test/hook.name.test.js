const hook = require('../src/hook');

describe('hook', () => {

    it('single attr', () => {
        const onLoadFn = jest.fn();
        const onLoadHook = jest.fn();
        const targetObj = {
            data: {
                name: 'target'
            },
            onLoad(a, b) {
                onLoadFn(this.data, a, b);
            }
        };
        const hooked = hook(targetObj, 'onLoad', {
            before(a, b) {
                onLoadHook(this.data, a, b);
            }
        });
        hooked.onLoad(100, 200);

        expect(onLoadFn.mock.calls[0]).toEqual([{name: 'target'}, 100, 200]);
        expect(onLoadHook.mock.calls[0]).toEqual([{name: 'target'}, 100, 200]);
    });

    it('nest single attr 1', () => {
        const onLoadFn = jest.fn();
        const onLoadHook = jest.fn();
        const targetObj = {
            data: {
                name: 'target'
            },
            life: {
                data: {
                    name: 'life'
                },
                onLoad(a, b) {
                    onLoadFn(this.data, a, b);
                }
            }
        };
        const hooked = hook(targetObj.life, 'onLoad', {
            before(a, b) {
                onLoadHook(this.data, a, b);
            }
        });
        hooked.onLoad(100, 200);
        expect(onLoadFn.mock.calls[0]).toEqual([{name: 'life'}, 100, 200]);
        expect(onLoadHook.mock.calls[0]).toEqual([{name: 'life'}, 100, 200]);
    });

    it('compound single attr 2', () => {
        const onLoadFn = jest.fn();
        const onLoadHook = jest.fn();
        const targetObj = {
            data: {
                name: 'target'
            },
            life: {
                data: {
                    name: 'life'
                },
                onLoad(a, b) {
                    onLoadFn(this.data, a, b);
                }
            }
        };
        const hooked = hook(targetObj, 'life.onLoad', {
            before(a, b) {
                onLoadHook(this.data, a, b);
            }
        });
        hooked.life.onLoad(100, 200);
        expect(onLoadFn.mock.calls[0]).toEqual([{name: 'life'}, 100, 200]);
        expect(onLoadHook.mock.calls[0]).toEqual([{name: 'life'}, 100, 200]);
    });


    it('none exist attr', () => {
        const onLoadHook = jest.fn();
        const targetObj = {
            data: {
                name: 'target'
            }
        };

        const hooked = hook(targetObj, 'onLoad', {
            before(a, b) {
                onLoadHook(this.data, a, b);
            }
        });
        hooked.onLoad(100, 200);
        expect(onLoadHook.mock.calls[0]).toEqual([{name: 'target'}, 100, 200]);
    });

    it('none exist compound attr', () => {
        const onLoadHook = jest.fn();
        const targetObj = {
            data: {
                name: 'target'
            }
        };

        const hooked = hook(targetObj, 'lifecycle.onLoad', {
            before(a, b) {
                onLoadHook(this.data, a, b);
            }
        }, targetObj);
        hooked.lifecycle.onLoad(100, 200);
        expect(onLoadHook.mock.calls[0]).toEqual([{name: 'target'}, 100, 200]);
    });

    it('compound attr with this', () => {
        const onLoadFn = jest.fn();
        const onLoadHook = jest.fn();
        const targetObj = {
            data: 'target.this',
            life: {
                data: 'life.this',
                onLoad(a, b) {
                    onLoadFn(this.data, a, b);
                }
            }
        };
        const hooked = hook(targetObj.life, 'onLoad', {
            before(a, b) {
                onLoadHook(this.data, a, b);
            }
        }, {data: "param.this"});

        hooked.onLoad(100, 200);
        expect(onLoadFn.mock.calls[0]).toEqual(["param.this", 100, 200]);
        expect(onLoadHook.mock.calls[0]).toEqual(["param.this", 100, 200]);
    });
});

