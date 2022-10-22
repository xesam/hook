const hook = require('../src/hook');

describe('hook root object', () => {
    let rawObj;
    let onLoadMock;
    let onShowMock;
    beforeEach(() => {
        onLoadMock = jest.fn();
        onShowMock = jest.fn();
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
            }
        };
    })
    it('when hook onLoad with config-object then onLoad.before and onLoad.afterReturn are called', () => {
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

    it('when hook onLoad with function-object then onLoad.before and onLoad.afterReturn are called', () => {
        const onLoadHook = jest.fn();
        const hooked = hook(rawObj, {
            onLoad(host) {
                return {
                    before(a, b) {
                        onLoadHook(host.name, this.data, a, b);
                    },
                    afterReturn(res, a, b) {
                        return {a, b};
                    }
                };
            }
        });

        const res = hooked.onLoad(100, 200);
        expect(onLoadMock.mock.calls[0]).toEqual(['rawObj.value', {name: 'rawObj.data.value'}, 100, 200]);
        expect(onLoadHook.mock.calls[0]).toEqual(['rawObj.value', {name: 'rawObj.data.value'}, 100, 200]);
        expect(res).toStrictEqual({a: 100, b: 200});
    });

    it('when hook none-exist method with falsy then change nothing', () => {
        const hooked = hook(rawObj, 'noneExist');
        expect(hooked.noneExist).toBeUndefined();
    });

    it('when hook none-exist method with void-return-function then change nothing', () => {
        const hooked = hook(rawObj, 'noneExist', function () {
        });
        expect(hooked.noneExist).toBeUndefined();
    });

    it('when hook none-exist method with empty object then create the method', () => {
        const hooked = hook(rawObj, 'noneExist', {});
        expect(hooked.noneExist).not.toBeUndefined();
    });

    it('when hook none-exist method with empty-return-function then create the method', () => {
        const hooked = hook(rawObj, 'noneExist', function () {
            return {};
        });
        expect(hooked.noneExist).not.toBeUndefined();
    });
    it('when hook none-exist method with config-object then create the method', () => {
        const noneExistHook = jest.fn();

        const hooked = hook(rawObj, 'noneExist', {
            before(a, b) {
                noneExistHook(this.name, this.data, a, b);
            }
        });
        hooked.noneExist(100, 200);
        expect(noneExistHook.mock.calls[0]).toEqual(['rawObj.value', {name: 'rawObj.data.value'}, 100, 200]);
    });
});

describe('hook child object', () => {
    let rawObj;
    let onLifetimeCreateMock;
    let onLifetimeReadyMock;
    beforeEach(() => {
        onLifetimeCreateMock = jest.fn();
        onLifetimeReadyMock = jest.fn();
        rawObj = {
            name: 'rawObj.value',
            data: {
                name: 'rawObj.data.value'
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
    it('when hook lifetimes with config-object then lifetimes.created.before and lifetimes.created.ready are called', () => {
        const theHook = jest.fn();
        const hooked = hook(rawObj.lifetimes, 'created', {
            before(a, b) {
                theHook(this.name, this.data, a, b);
            },
            afterReturn(res, a, b) {
                return {a, b};
            }
        });

        const res = hooked.created(100, 200);
        hooked.ready(100, 200);
        expect(theHook.mock.calls[0]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}, 100, 200]);
        expect(onLifetimeCreateMock.mock.calls[0]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}, 100, 200]);
        expect(onLifetimeReadyMock.mock.calls[0]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}]);
        expect(res).toStrictEqual({a: 100, b: 200});
    });

    it('when hook lifetimes with function-object then lifetimes.created.before and lifetimes.created.ready are called', () => {
        const theHook = jest.fn();
        const hooked = hook(rawObj.lifetimes, {
            created(host) {
                return {
                    before(a, b) {
                        theHook(host.name, this.data, a, b);
                    },
                    afterReturn(res, a, b) {
                        return {a, b};
                    }
                };
            }
        });

        const res = hooked.created(100, 200);
        hooked.ready(100, 200);
        expect(theHook.mock.calls[0]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}, 100, 200]);
        expect(onLifetimeCreateMock.mock.calls[0]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}, 100, 200]);
        expect(onLifetimeReadyMock.mock.calls[0]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}]);
        expect(res).toStrictEqual({a: 100, b: 200});
    });

    it('when hook lifetimes with custom context then use the custom context', () => {
        const onLifetimeCreateHook = jest.fn();
        const hooked = hook(rawObj.lifetimes, 'created', {
            before(a, b) {
                onLifetimeCreateHook(this.data, a, b);
            }
        }, {data: {name: "custom.value"}});

        hooked.created(100, 200);
        expect(onLifetimeCreateHook.mock.calls[0]).toEqual([{name: "custom.value"}, 100, 200]);
        expect(onLifetimeCreateMock.mock.calls[0]).toEqual([undefined, {name: 'custom.value'}, 100, 200]);
    });

    it('when hook lifetimes with function-object and custom context then use the custom context', () => {
        const onLifetimeCreateHook = jest.fn();
        const hooked = hook(rawObj.lifetimes, {
            created(host) {
                return {
                    before(a, b) {
                        onLifetimeCreateHook(host.name, this.data, a, b);
                    }
                };
            }
        }, {data: {name: "custom.value"}});

        hooked.created(100, 200);
        expect(onLifetimeCreateHook.mock.calls[0]).toEqual(["lifetimes.value", {name: "custom.value"}, 100, 200]);
        expect(onLifetimeCreateMock.mock.calls[0]).toEqual([undefined, {name: 'custom.value'}, 100, 200]);
    });
});

describe('hook compound method', () => {
    let rawObj;
    let onLifetimeCreateMock;
    let onLifetimeReadyMock;
    beforeEach(() => {
        onLifetimeCreateMock = jest.fn();
        onLifetimeReadyMock = jest.fn();
        rawObj = {
            name: 'rawObj.value',
            data: {
                name: 'rawObj.data.value'
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
    it('when hook lifetimes with config-object then lifetimes.created.before and lifetimes.created.ready are called', () => {
        const theHook = jest.fn();
        const hooked = hook(rawObj, 'lifetimes.created', {
            before(a, b) {
                theHook(this.name, this.data, a, b);
            },
            afterReturn(res, a, b) {
                return {a, b};
            }
        });

        const res = hooked.lifetimes.created(100, 200);
        hooked.lifetimes.ready(100, 200);
        expect(theHook.mock.calls[0]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}, 100, 200]);
        expect(onLifetimeCreateMock.mock.calls[0]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}, 100, 200]);
        expect(onLifetimeReadyMock.mock.calls[0]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}]);
        expect(res).toStrictEqual({a: 100, b: 200});
    });

    it('when hook lifetimes with function-object then lifetimes.created.before and lifetimes.created.afterReturn are called', () => {
        const theHook = jest.fn();
        const hooked = hook(rawObj, {
            'lifetimes.created'(host) {
                return {
                    before(a, b) {
                        theHook(host.name, this.data, a, b);
                    },
                    afterReturn(res, a, b) {
                        return {a, b};
                    }
                };
            }
        });

        const res =  hooked.lifetimes.created(100, 200);
        hooked.lifetimes.ready(100, 200);
        expect(theHook.mock.calls[0]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}, 100, 200]);
        expect(onLifetimeCreateMock.mock.calls[0]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}, 100, 200]);
        expect(onLifetimeReadyMock.mock.calls[0]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}]);
        expect(res).toStrictEqual({a: 100, b: 200});
    });

    it('when hook lifetimes with function-object and custom context then use the custom context', () => {
        const theHook = jest.fn();
        const hooked = hook(rawObj, {
            'lifetimes.created'(host) {
                return {
                    before(a, b) {
                        theHook(host.name, this.data, a, b);
                    }
                };
            }
        }, {data: {name: "param.this"}});

        hooked.lifetimes.created(100, 200);
        expect(theHook.mock.calls[0]).toEqual(['lifetimes.value', {name: "param.this"}, 100, 200]);
        expect(onLifetimeCreateMock.mock.calls[0]).toEqual([undefined, {name: 'param.this'}, 100, 200]);
    });

});

