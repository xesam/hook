const defaultHook = require('../src/hook');
const customHook = defaultHook.create('#');

describe('hook attr', () => {
    it('default hook', () => {
        const onLoadHook = jest.fn();
        const targetObj = {
            data: {
                name: 'target'
            },
            life: {
                data: {
                    name: 'life'
                }
            }
        };
        const hooked = defaultHook(targetObj, {
            'life.onLoad': {
                before(a, b) {
                    onLoadHook(this.data, a, b);
                }
            },

            'life.onShow'() {
                return {
                    before(a, b) {
                        onLoadHook(this.data, a, b);
                    }
                }
            }
        });
        hooked.life.onLoad(100, 200);
        hooked.life.onShow(300, 400);

        expect(onLoadHook).toBeCalledTimes(2);
        expect(onLoadHook.mock.calls[0]).toEqual([{name: 'life'}, 100, 200]);
        expect(onLoadHook.mock.calls[1]).toEqual([{name: 'life'}, 300, 400]);
    });
    it('custom hook', () => {
        const onLoadHook = jest.fn();
        const targetObj = {
            data: {
                name: 'target'
            },
            life: {
                data: {
                    name: 'life'
                }
            }
        };
        const hooked = customHook(targetObj, {
            'life#onLoad': {
                before(a, b) {
                    onLoadHook(this.data, a, b);
                }
            },

            'life#onShow'() {
                return {
                    before(a, b) {
                        onLoadHook(this.data, a, b);
                    }
                }
            }
        });
        hooked.life.onLoad(100, 200);
        hooked.life.onShow(300, 400);

        expect(onLoadHook).toBeCalledTimes(2);
        expect(onLoadHook.mock.calls[0]).toEqual([{name: 'life'}, 100, 200]);
        expect(onLoadHook.mock.calls[1]).toEqual([{name: 'life'}, 300, 400]);
    });
});

