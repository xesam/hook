const decorate = require('../src/decorate');

describe('decorate', () => {
    it('decorate#_function without decoration', () => {
        const srcFn = jest.fn();
        const decorated = decorate(srcFn);
        decorated(100, 200);
        expect(srcFn.mock.calls[0]).toEqual([100, 200]);
    });

    it('decorate#_function with decoration 1', () => {
        global.name = 'global.extra';
        const srcFn = jest.fn();
        const testFn = jest.fn();

        function decoration(src, a, b) {
            testFn(this.name, a, b);
        }

        const decorated = decorate(srcFn, decoration);
        decorated(100, 200);
        expect(srcFn).toBeCalledTimes(0);
        expect(testFn.mock.calls[0]).toEqual(['global.extra', 100, 200]);
    });

    it('decorate#_function with decoration 2', () => {
        const srcFn = jest.fn();
        const beforeCallback = jest.fn();
        const afterCallback = jest.fn();

        let decorated = decorate(srcFn, function (src, a, b) {
            beforeCallback(a, b);
            src(a, b);
            afterCallback(a, b);
        });
        decorated(100, 200);

        expect(beforeCallback).toBeCalledTimes(1);
        expect(beforeCallback.mock.calls[0]).toEqual([100, 200]);
        expect(srcFn).toBeCalledTimes(1);
        expect(srcFn.mock.calls[0]).toEqual([100, 200]);
        expect(afterCallback).toBeCalledTimes(1);
        expect(afterCallback.mock.calls[0]).toEqual([100, 200]);
    });

    it('decorate#_function chain', () => {
        const srcFn = jest.fn();
        const beforeCallback = jest.fn();
        const afterCallback = jest.fn();

        const decorated = decorate(srcFn, function (src, a, b) {
            beforeCallback(a, b);// 3st
            src(a, b); // 4st
            afterCallback(a, b); // 5st
        }).decorate(function (src, a, b) {
            beforeCallback(a, b + 1); // 1st
            src(a, b); // 2st
            afterCallback(a, b + 1);// 6st
        });
        decorated(100, 200);

        expect(beforeCallback).toBeCalledTimes(2);
        expect(beforeCallback.mock.calls[0]).toEqual([100, 201]);
        expect(beforeCallback.mock.calls[1]).toEqual([100, 200]);
        expect(srcFn).toBeCalledTimes(1);
        expect(srcFn.mock.calls[0]).toEqual([100, 200]);
        expect(afterCallback).toBeCalledTimes(2);
        expect(afterCallback.mock.calls[0]).toEqual([100, 200]);
        expect(afterCallback.mock.calls[1]).toEqual([100, 201]);
    });

    it('decorate#_function with default this', () => {
        const mockFn = jest.fn();
        global.extra = 'global.extra';

        function srcFn(a, b) {
            mockFn(this.extra, a, b);
        }

        srcFn.extra = 'fn.extra';
        const decorated = decorate(srcFn, function (src, b) {
            src(this.extra, b);
        });

        decorated(100);
        expect(mockFn.mock.calls[0]).toEqual(['global.extra', 'global.extra', 100]);
    });

    it('decorate#_function with extra context', () => {
        const mockFn = jest.fn();
        global.extra = 'global.extra';

        function srcFn(a, b) {
            mockFn(this.extra, a, b);
        }

        srcFn.extra = 'fn.extra';
        const thisArg = {
            extra: 'param.extra'
        };
        const decorated = decorate(srcFn, function (src, a, b) {
            src.call(this, a, b);
        }, thisArg);

        decorated(100, 200);
        expect(mockFn.mock.calls[0]).toEqual(['param.extra', 100, 200]);
    });

    it('decorate#_object', () => {
        const srcFn = jest.fn().mockReturnValue('this is src');
        const beforeCallback = jest.fn();
        const afterCallback = jest.fn();

        let decorated = decorate(srcFn, {
            before(a, b) {
                beforeCallback(a, b);
            },
            after(res, a, b) {
                afterCallback(a, b);
                return res;
            }
        });
        const finalResult = decorated(100, 200);

        expect(beforeCallback).toBeCalledTimes(1);
        expect(srcFn).toBeCalledTimes(1);
        expect(afterCallback).toBeCalledTimes(1);
        expect(finalResult).toEqual("this is src");
    });

    it('decorate#_object chain', () => {
        const srcFn = jest.fn();
        const beforeCallback = jest.fn();
        const afterCallback = jest.fn();

        let decorated = decorate(srcFn, {
            before(a, b) {
                beforeCallback(a, b);
            },
            after(res, a, b) {
                afterCallback(a, b);
            }
        });
        decorated = decorated.decorate({
            before(a, b) {
                beforeCallback(a, b);
            },
            after(a, b) {
                afterCallback(a, b);
            }
        });
        decorated(100, 200);

        expect(beforeCallback).toBeCalledTimes(2);
        expect(srcFn).toBeCalledTimes(1);
        expect(afterCallback).toBeCalledTimes(2);
    });

    it('decorate#_object with this', () => {
        const mockFn = jest.fn();
        const beforeCallback = jest.fn();
        const afterCallback = jest.fn();

        global.extra = 'global.extra';

        function srcFn(a, b) {
            mockFn(this.extra, a, b);
        }

        srcFn.extra = 'fn.extra';
        const decorated = decorate(srcFn, {
            before(a, b) {
                beforeCallback(this.extra, a, b);
            },
            after(res, a, b) {
                afterCallback(this.extra, a, b);
            }
        });
        decorated(100, 200);

        expect(beforeCallback.mock.calls[0]).toEqual(['global.extra', 100, 200]);
        expect(mockFn.mock.calls[0]).toEqual(['global.extra', 100, 200]);
        expect(afterCallback.mock.calls[0]).toEqual(['global.extra', 100, 200]);
    });

    it('decorate#_object with extra this', () => {
        const srcFn = jest.fn();
        const beforeCallback = jest.fn();
        const afterCallback = jest.fn();

        function fn(a, b) {
            srcFn(this.name, a, b);
        }

        fn.name = 'fn.extra';
        const thisArg = {
            name: 'param.extra'
        };
        const decorated = decorate(fn, {
            before(a, b) {
                beforeCallback(this.name, a, b);
            },
            after(res, a, b) {
                afterCallback(this.name, a, b);
            }
        }, thisArg);
        decorated(100, 200);

        expect(beforeCallback.mock.calls[0]).toEqual(['param.extra', 100, 200]);
        expect(srcFn.mock.calls[0]).toEqual(['param.extra', 100, 200]);
        expect(afterCallback.mock.calls[0]).toEqual(['param.extra', 100, 200]);
    });

    it('decorate throw', () => {
        const beforeCallback = jest.fn();
        const afterCallback = jest.fn();
        const throwCallback = jest.fn();

        function fn() {
            throw {msg: 'fn.error'};
        }

        const decorated = decorate(fn, {
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
        decorated(100, 200);
        expect(beforeCallback).toBeCalled();
        expect(afterCallback).not.toBeCalled();
        expect(throwCallback).toBeCalled();
    });
});