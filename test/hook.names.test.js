const hook = require('../src/hook');

describe('hook multi names', () => {
    let rawObj;
    let onLoadMock;
    let onShowMock;
    let onLifetimeCreateMock;
    let onLifetimeReadyMock;
    beforeEach(() => {
        onLoadMock = jest.fn();
        onShowMock = jest.fn();
        onLifetimeCreateMock = jest.fn();
        onLifetimeReadyMock = jest.fn();
        rawObj = {
            name: 'rawObj.value',
            data: {
                name: 'rawObj.data.value'
            },
            onLoad(a, b) {
                onLoadMock(this.name, this.data, a, b);
            },
            onShow() {
                onShowMock(this.name, this.data);
            },
            lifetimes: {
                name: 'lifetimes.value',
                data: {
                    name: 'lifetimes.data.value'
                },
                created(a, b) {
                    onLifetimeCreateMock(this.name, this.data, a, b);
                },
                ready() {
                    onLifetimeReadyMock(this.name, this.data);
                }
            }
        };
    })
    it("when hook rawObj with ['onLoad', 'onShow'] then hook onLoad and hook onShow", () => {
        const onHookMock = jest.fn();
        const hooked = hook(rawObj, ['onLoad', 'onShow'], {
            before(a, b) {
                onHookMock(this.data, a, b);
            }
        });
        hooked.onLoad(100, 200);
        hooked.onShow(300, 400);

        expect(onHookMock).toBeCalledTimes(2);
        expect(onHookMock.mock.calls[0]).toEqual([{name: 'rawObj.data.value'}, 100, 200]);
        expect(onHookMock.mock.calls[1]).toEqual([{name: 'rawObj.data.value'}, 300, 400]);
        expect(onLoadMock.mock.calls[0]).toEqual(['rawObj.value', {name: 'rawObj.data.value'}, 100, 200]);
        expect(onShowMock.mock.calls[0]).toEqual(['rawObj.value', {name: 'rawObj.data.value'}]);
    });

    it("when hook rawObj with ['lifetimes.created', 'lifetimes.ready'] then hook lifetimes.created and hook lifetimes.ready", () => {
        const onHookMock = jest.fn();
        const hooked = hook(rawObj, ['lifetimes.created', 'lifetimes.ready'], {
            before(a, b) {
                onHookMock(this.data, a, b);
            }
        });
        hooked.lifetimes.created(100, 200);
        hooked.lifetimes.ready(300, 400);

        expect(onHookMock).toBeCalledTimes(2);
        expect(onHookMock.mock.calls[0]).toEqual([{name: 'lifetimes.data.value'}, 100, 200]);
        expect(onHookMock.mock.calls[1]).toEqual([{name: 'lifetimes.data.value'}, 300, 400]);
        expect(onLifetimeCreateMock.mock.calls[0]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}, 100, 200]);
        expect(onLifetimeReadyMock.mock.calls[0]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}]);
    });

    it("when hook rawObj with decoration then hook lifetimes.created and hook lifetimes.ready", () => {
        const onHookMock = jest.fn();
        const hooked = hook(rawObj, {
            'lifetimes.created': {
                before(a, b) {
                    onHookMock(this.data, a, b);
                }
            },

            'lifetimes.ready'() {
                return {
                    before(a, b) {
                        onHookMock(this.data, a, b);
                    }
                }
            }
        });
        hooked.lifetimes.created(100, 200);
        hooked.lifetimes.ready(300, 400);

        expect(onHookMock).toBeCalledTimes(2);
        expect(onHookMock.mock.calls[0]).toEqual([{name: 'lifetimes.data.value'}, 100, 200]);
        expect(onHookMock.mock.calls[1]).toEqual([{name: 'lifetimes.data.value'}, 300, 400]);
        expect(onLifetimeCreateMock.mock.calls[0]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}, 100, 200]);
        expect(onLifetimeReadyMock.mock.calls[0]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}]);
    });
});

