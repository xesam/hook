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
    it("when hook ['onLoad', 'onShow'] with config-object then hook onLoad and onShow", () => {
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

    it("when hook rootObj with named-config-object then hook onLoad and onShow", () => {
        const onHookMock = jest.fn();
        const hooked = hook(rawObj, {
            onLoad: {
                before(a, b) {
                    onHookMock(this.data, a, b);
                }
            },
            onShow: {
                before(a, b) {
                    onHookMock(this.data, a, b);
                }
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

    it("when hook rootObj with named-function-object then pass host-argument to onLoad and onShow", () => {
        const onHookMock = jest.fn();
        const hooked = hook(rawObj, {
            onLoad(host) {
                return {
                    before(a, b) {
                        onHookMock(host.name, this.data, a, b);
                    }
                }
            },
            onShow(host) {
                return {
                    before(a, b) {
                        onHookMock(host.name, this.data, a, b);
                    }
                }
            }
        });
        hooked.onLoad(100, 200);
        hooked.onShow(300, 400);

        expect(onHookMock).toBeCalledTimes(2);
        expect(onHookMock.mock.calls[0]).toEqual(['rawObj.value', {name: 'rawObj.data.value'}, 100, 200]);
        expect(onHookMock.mock.calls[1]).toEqual(['rawObj.value', {name: 'rawObj.data.value'}, 300, 400]);
        expect(onLoadMock.mock.calls[0]).toEqual(['rawObj.value', {name: 'rawObj.data.value'}, 100, 200]);
        expect(onShowMock.mock.calls[0]).toEqual(['rawObj.value', {name: 'rawObj.data.value'}]);
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
    it("when hook rawObj.lifetimes with ['created', 'ready'] then hook created and ready", () => {
        const onHookMock = jest.fn();
        const hooked = hook(rawObj.lifetimes, ['created', 'ready'], {
            before(a, b) {
                onHookMock(this.data, a, b);
            }
        });
        hooked.created(100, 200);
        hooked.ready(300, 400);

        expect(onHookMock).toBeCalledTimes(2);
        expect(onHookMock.mock.calls[0]).toEqual([{name: 'lifetimes.data.value'}, 100, 200]);
        expect(onHookMock.mock.calls[1]).toEqual([{name: 'lifetimes.data.value'}, 300, 400]);
        expect(onLifetimeCreateMock.mock.calls[0]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}, 100, 200]);
        expect(onLifetimeReadyMock.mock.calls[0]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}]);
    });

    it("when hook rawObj.lifetimes with named-config-object then hook created and ready", () => {
        const onHookMock = jest.fn();
        const hooked = hook(rawObj.lifetimes, {
            created: {
                before(a, b) {
                    onHookMock(this.data, a, b);
                }
            },
            ready: {
                before(a, b) {
                    onHookMock(this.data, a, b);
                }
            }
        });
        hooked.created(100, 200);
        hooked.ready(300, 400);

        expect(onHookMock).toBeCalledTimes(2);
        expect(onHookMock.mock.calls[0]).toEqual([{name: 'lifetimes.data.value'}, 100, 200]);
        expect(onHookMock.mock.calls[1]).toEqual([{name: 'lifetimes.data.value'}, 300, 400]);
        expect(onLifetimeCreateMock.mock.calls[0]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}, 100, 200]);
        expect(onLifetimeReadyMock.mock.calls[0]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}]);
    });

    it("when hook rawObj.lifetimes with named-function-object then pass host-argument to created and ready", () => {
        const onHookMock = jest.fn();
        const hooked = hook(rawObj.lifetimes, {
            created(host) {
                return {
                    before(a, b) {
                        onHookMock(host.name, this.data, a, b);
                    }
                }
            },
            ready(host) {
                return {
                    before(a, b) {
                        onHookMock(host.name, this.data, a, b);
                    }
                }
            }
        });
        hooked.created(100, 200);
        hooked.ready(300, 400);

        expect(onHookMock).toBeCalledTimes(2);
        expect(onHookMock.mock.calls[0]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}, 100, 200]);
        expect(onHookMock.mock.calls[1]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}, 300, 400]);
        expect(onLifetimeCreateMock.mock.calls[0]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}, 100, 200]);
        expect(onLifetimeReadyMock.mock.calls[0]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}]);
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
    it("when hook rawObj with ['lifetimes.created', 'lifetimes.ready'] then hook created and ready", () => {
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

    it("when hook rawObj with named-config-object then hook created and ready", () => {
        const onHookMock = jest.fn();
        const hooked = hook(rawObj, {
            'lifetimes.created': {
                before(a, b) {
                    onHookMock(this.data, a, b);
                }
            },
            'lifetimes.ready': {
                before(a, b) {
                    onHookMock(this.data, a, b);
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

    it("when hook rawObj with named-function-object then pass host-argument to created and ready", () => {
        const onHookMock = jest.fn();
        const hooked = hook(rawObj, {
            'lifetimes.created'(host) {
                return {
                    before(a, b) {
                        onHookMock(host.name, this.data, a, b);
                    }
                }
            },
            'lifetimes.ready'(host) {
                return {
                    before(a, b) {
                        onHookMock(host.name, this.data, a, b);
                    }
                }
            }
        });
        hooked.lifetimes.created(100, 200);
        hooked.lifetimes.ready(300, 400);

        expect(onHookMock).toBeCalledTimes(2);
        expect(onHookMock.mock.calls[0]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}, 100, 200]);
        expect(onHookMock.mock.calls[1]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}, 300, 400]);
        expect(onLifetimeCreateMock.mock.calls[0]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}, 100, 200]);
        expect(onLifetimeReadyMock.mock.calls[0]).toEqual(['lifetimes.value', {name: 'lifetimes.data.value'}]);
    });
});