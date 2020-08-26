const hook = require('../index');

describe('hook function', () => {
    it('hook nothing', () => {
        const targetFn = jest.fn();
        const beforeCallback = jest.fn();
        const afterCallback = jest.fn();

        const hooked = hook(targetFn);
        hooked();
        expect(beforeCallback).not.toBeCalled();
        expect(targetFn).toBeCalled();
        expect(afterCallback).not.toBeCalled();
    });

    it('hook function', () => {
        const targetFn = jest.fn();
        const beforeCallback = jest.fn();
        const afterCallback = jest.fn();

        let hooked = hook(targetFn, {
            before() {
                beforeCallback(1);
            },
            after() {
                afterCallback(1);
            }
        });

        hooked = hook(hooked, {
            before() {
                beforeCallback(2);
            },
            after() {
                afterCallback(2);
            }
        });
        hooked(100, 200);

        expect(beforeCallback.mock.calls[0]).toEqual([2]);
        expect(beforeCallback.mock.calls[1]).toEqual([1]);

        expect(targetFn.mock.calls[0]).toEqual([100, 200]);

        expect(afterCallback.mock.calls[0]).toEqual([1]);
        expect(afterCallback.mock.calls[1]).toEqual([2]);
    });

    it('hook function this', () => {
        const targetFn = jest.fn();
        const beforeCallback = jest.fn();
        const afterCallback = jest.fn();

        function fn(a, b) {
            targetFn(this.name, a, b);
        }

        const obj = {
            name: 'target'
        };

        obj.fn = hook(fn, {
            name: 'hook',
            before() {
                beforeCallback();
            },
            after() {
                afterCallback();
            }
        });
        obj.fn(100, 200);
        expect(targetFn.mock.calls[0][0]).toBe('target');
        expect(targetFn.mock.calls[0][1]).toBe(100);
        expect(targetFn.mock.calls[0][2]).toBe(200);
    });

    it('hook throw', () => {
        const beforeCallback = jest.fn();
        const afterCallback = jest.fn();
        const throwCallback = jest.fn();

        function fn() {
            throw new Error();
        }

        const hooked = hook(fn, {
            before() {
                beforeCallback();
            },
            after() {
                afterCallback();
            },
            afterThrow(e) {
                throwCallback(e);
            }
        });
        hooked();
        expect(beforeCallback).toBeCalled();
        expect(afterCallback).toBeCalled();
        expect(throwCallback).toBeCalled();
    });
});

describe('hook simple', () => {
    it('simple', () => {
        const targetOnLoad = jest.fn();
        const targetOnShow = jest.fn();
        const beforeCallback = jest.fn();
        const afterCallback = jest.fn();

        const obj = {
            id: 1,
            onLoad(query) {
                targetOnLoad(query, this.id);
            },
            onShow() {
                targetOnShow(this.id);
            }
        };

        const obj2 = hook.simple(obj, ['onLoad', 'onShow'], {
            id: 2,
            before() {
                beforeCallback(this.id);
            },
            after() {
                afterCallback(this.id);
            }
        });

        const obj3 = hook.simple(obj2, ['onLoad'], {
            id: 3,
            before() {
                beforeCallback(this.id);
            },
            after() {
                afterCallback(this.id);
            }
        });
        obj3.onLoad(100);
        expect(targetOnLoad).toBeCalledTimes(1);
        expect(targetOnLoad.mock.calls[0]).toEqual([100, 1]);

        expect(beforeCallback).toBeCalledTimes(2);
        expect(beforeCallback.mock.calls[0]).toEqual([1]);

        expect(afterCallback).toBeCalledTimes(2);
        expect(afterCallback.mock.calls[0]).toEqual([1]);

        obj3.onShow();
        expect(targetOnShow).toBeCalledTimes(1);
        expect(targetOnShow.mock.calls[0]).toEqual([1]);

        expect(beforeCallback).toBeCalledTimes(3);
        expect(beforeCallback.mock.calls[2]).toEqual([1]);

        expect(afterCallback).toBeCalledTimes(3);
        expect(afterCallback.mock.calls[2]).toEqual([1]);
    })
});