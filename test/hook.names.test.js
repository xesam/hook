const hook = require('../src/hook');

describe('hook attr', () => {
    it('single names', () => {
        const onLoadFn = jest.fn();
        const onLoadHook = jest.fn();
        const targetObj = {
            data: {
                name: 'target'
            },
            onLoad(a, b) {
                onLoadFn(this.data, a, b);
            },
            onShow(a, b) {
                onLoadFn(this.data, a, b);
            }
        };
        const hooked = hook(targetObj, ['onLoad', 'onShow'], {
            before(a, b) {
                onLoadHook(this.data, a, b);
            }
        });
        hooked.onLoad(100, 200);
        hooked.onShow(100, 200);

        expect(onLoadFn).toBeCalledTimes(2);
        expect(onLoadFn.mock.calls[0]).toEqual([{name: 'target'}, 100, 200]);

        expect(onLoadHook).toBeCalledTimes(2);
        expect(onLoadHook.mock.calls[0]).toEqual([{name: 'target'}, 100, 200]);
    });
    it('nest nest names', () => {
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
                },
                onShow(a, b) {
                    onLoadFn(this.data, a, b);
                }
            }
        };
        const hooked = hook(targetObj, ['life.onLoad', 'life.onShow'], {
            before(a, b) {
                onLoadHook(this.data, a, b);
            }
        });
        hooked.life.onLoad(100, 200);
        hooked.life.onShow(100, 200);

        expect(onLoadFn).toBeCalledTimes(2);
        expect(onLoadFn.mock.calls[0]).toEqual([{name: 'life'}, 100, 200]);

        expect(onLoadHook).toBeCalledTimes(2);
        expect(onLoadHook.mock.calls[0]).toEqual([{name: 'life'}, 100, 200]);
    });
});

