const hook = require('../src/hook');

describe('hook single name', () => {
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
    it('when hook onLoad then onLoad.before is called', () => {
        const onLoadHook = jest.fn();
        const hooked = hook(rawObj, 'onLoad', {
            before(a, b) {
                onLoadHook(this.data, a, b);
            }
        });

        hooked.onLoad(100, 200);
        expect(onLoadMock.mock.calls[0]).toEqual(['rawObj.value', {name: 'rawObj.data.value'}, 100, 200]);
        expect(onLoadHook.mock.calls[0]).toEqual([{name: 'rawObj.data.value'}, 100, 200]);
    });

    it('when hook a non exist method with null then change nothing', () => {
        const hooked = hook(rawObj, 'nonExist');
        expect(hooked.nonExist).toBeUndefined();
    });

    it('when hook a non exist method with void function then change nothing', () => {
        const hooked = hook(rawObj, 'nonExist', function () {
        });
        expect(hooked.nonExist).toBeUndefined();
    });

    it('when hook a non exist method with empty object then change nothing', () => {
        const hooked = hook(rawObj, 'nonExist', {});
        expect(hooked.nonExist).not.toBeUndefined();
    });

    it('when hook a non exist method with empty function then change nothing', () => {
        const hooked = hook(rawObj, 'nonExist', function () {
            return {};
        });
        expect(hooked.nonExist).not.toBeUndefined();
    });

    it('when hook the nest method then use nest context', () => {
        const onLifetimeCreateHook = jest.fn();
        const hooked = hook(rawObj.lifetimes, 'created', {
            before(a, b) {
                onLifetimeCreateHook(this.data, a, b);
            }
        });
        hooked.created(100, 200);
        expect(onLifetimeCreateHook.mock.calls[0]).toEqual([{name: 'lifetimes.data.value'}, 100, 200]);
        expect(onLifetimeCreateMock.mock.calls[0]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}, 100, 200]);
    });

    it('when hook the nest attr then use nest context', () => {
        const onLifetimeCreateHook = jest.fn();
        const hooked = hook(rawObj, 'lifetimes.created', {
            before(a, b) {
                onLifetimeCreateHook(this.data, a, b);
            }
        });
        hooked.lifetimes.created(100, 200);
        expect(onLifetimeCreateHook.mock.calls[0]).toEqual([{name: 'lifetimes.data.value'}, 100, 200]);
        expect(onLifetimeCreateMock.mock.calls[0]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}, 100, 200]);
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

