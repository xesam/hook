const defaultHook = require('../src/hook');

describe('hook create', () => {
    let customHook;
    let rawObj;
    let onLoadMock;
    let onLifetimeCreateMock;
    beforeEach(() => {
        customHook = defaultHook.create('#');
        onLoadMock = jest.fn();
        onLifetimeCreateMock = jest.fn();
        rawObj = {
            name: 'rawObj.value',
            data: {
                name: 'rawObj.data.value'
            },
            onLoad(a, b) {
                onLoadMock(this.name, this.data, a, b);
            },
            lifetimes: {
                name: 'lifetimes.value',
                data: {
                    name: 'lifetimes.data.value'
                },
                created(a, b) {
                    onLifetimeCreateMock(this.name, this.data, a, b);
                }
            }
        };
    })
    it('when create a new hook then the default hook keep origin', () => {
        const onMockHook = jest.fn();
        const hooked = defaultHook(rawObj, {
            'onLoad': {
                before(a, b) {
                    onMockHook(this.data, a, b);
                }
            },

            'lifetimes.created'() {
                return {
                    before(a, b) {
                        onMockHook(this.data, a, b);
                    }
                }
            }
        });
        hooked.onLoad(100, 200);
        hooked.lifetimes.created(300, 400);

        expect(onMockHook).toBeCalledTimes(2);
        expect(onMockHook.mock.calls[0]).toEqual([{name: 'rawObj.data.value'}, 100, 200]);
        expect(onMockHook.mock.calls[1]).toEqual([{name: 'lifetimes.data.value'}, 300, 400]);
    });
    it('when hook with customHook then customHook is applied', () => {
        const onMockHook = jest.fn();
        const hooked = customHook(rawObj, {
            'onLoad': {
                before(a, b) {
                    onMockHook(this.data, a, b);
                }
            },

            'lifetimes#created'() {
                return {
                    before(a, b) {
                        onMockHook(this.data, a, b);
                    }
                }
            }
        });
        hooked.onLoad(100, 200);
        hooked.lifetimes.created(300, 400);

        expect(onMockHook).toBeCalledTimes(2);
        expect(onMockHook.mock.calls[0]).toEqual([{name: 'rawObj.data.value'}, 100, 200]);
        expect(onMockHook.mock.calls[1]).toEqual([{name: 'lifetimes.data.value'}, 300, 400]);
    });
});

