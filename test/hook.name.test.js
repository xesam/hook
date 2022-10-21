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
            },
            afterReturn(res, a, b) {
                return {a, b};
            }
        });

        const res = hooked.onLoad(100, 200);
        expect(onLoadMock.mock.calls[0]).toEqual(['rawObj.value', {name: 'rawObj.data.value'}, 100, 200]);
        expect(onLoadHook.mock.calls[0]).toEqual([{name: 'rawObj.data.value'}, 100, 200]);
        expect(res).toStrictEqual({a: 100, b: 200});
    });

    it('when hook a none-exist method with null then change nothing', () => {
        const hooked = hook(rawObj, 'noneExist');
        expect(hooked.noneExist).toBeUndefined();
    });

    it('when hook a none-exist method with void-return-function then change nothing', () => {
        const hooked = hook(rawObj, 'noneExist', function () {
        });
        expect(hooked.noneExist).toBeUndefined();
    });

    it('when hook a none-exist method with empty object then change nothing', () => {
        const hooked = hook(rawObj, 'noneExist', {});
        expect(hooked.noneExist).not.toBeUndefined();
    });

    it('when hook none-exist method with empty-return-function then change nothing', () => {
        const hooked = hook(rawObj, 'noneExist', function () {
            return {};
        });
        expect(hooked.noneExist).not.toBeUndefined();
    });
    it('when hook none-exist method with config then create the method', () => {
        const onnoneExistHook = jest.fn();

        const hooked = hook(rawObj, 'noneExist', {
            before(a, b) {
                onnoneExistHook(this.name, this.data, a, b);
            }
        });
        hooked.noneExist(100, 200);
        expect(onnoneExistHook.mock.calls[0]).toEqual(['rawObj.value', {name: 'rawObj.data.value'}, 100, 200]);
    });

    it('when hook none-exist method with config then create the method', () => {
        const onnoneExistHook = jest.fn();

        const hooked = hook(rawObj, 'lifetimes.noneExist', {
            before(a, b) {
                onnoneExistHook(this.name, this.data, a, b);
            }
        });
        hooked.lifetimes.noneExist(100, 200);
        expect(onnoneExistHook.mock.calls[0]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}, 100, 200]);
    });

    it('when hook child object then use child object as context', () => {
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

    it('when hook child object with param context then use the param context', () => {
        const onLifetimeCreateHook = jest.fn();
        const hooked = hook(rawObj.lifetimes, 'created', {
            before(a, b) {
                onLifetimeCreateHook(this.data, a, b);
            }
        }, {data: {name: "param.this"}});

        hooked.created(100, 200);
        expect(onLifetimeCreateHook.mock.calls[0]).toEqual([{name: "param.this"}, 100, 200]);
        expect(onLifetimeCreateMock.mock.calls[0]).toEqual([undefined, {name: 'param.this'}, 100, 200]);
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

    it('when hook the nest attr with param context then use the param context', () => {
        const onLifetimeCreateHook = jest.fn();
        const hooked = hook(rawObj, 'lifetimes.created', {
            before(a, b) {
                onLifetimeCreateHook(this.data, a, b);
            }
        }, {data: {name: "param.this"}});

        hooked.lifetimes.created(100, 200);
        expect(onLifetimeCreateHook.mock.calls[0]).toEqual([{name: "param.this"}, 100, 200]);
        expect(onLifetimeCreateMock.mock.calls[0]).toEqual([undefined, {name: 'param.this'}, 100, 200]);
    });

});

