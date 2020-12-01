const hook = require('../index');

describe('hook function', () => {
    it('hook empty', () => {
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

        function fn(a, b) {
            targetFn(this.name, a, b);
        }

        const obj = {
            name: 'obj this'
        };

        obj.fn = hook(fn, {
            name: 'hook',
            before() {
                beforeCallback(this.name);
            }
        });
        obj.fn(100, 200);
        expect(beforeCallback.mock.calls[0][0]).toBe('obj this');
        expect(targetFn.mock.calls[0][0]).toBe('obj this');
        expect(targetFn.mock.calls[0][1]).toBe(100);
        expect(targetFn.mock.calls[0][2]).toBe(200);
    });

    it('hook function this (2)', () => {
        const targetFn = jest.fn();
        const beforeCallback = jest.fn();

        function fn(a, b) {
            targetFn(this.name, a, b);
        }

        const obj = {
            name: 'obj this'
        };

        obj.fn = hook(fn, {
            name: 'hook this',
            before() {
                beforeCallback(this.name);
            }
        }, {name: 'arg this'});
        obj.fn(100, 200);
        expect(beforeCallback.mock.calls[0][0]).toBe('arg this');
        expect(targetFn.mock.calls[0][0]).toBe('arg this');
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