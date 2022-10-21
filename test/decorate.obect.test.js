const decorate = require('../src/decorate');
describe('decorate with object', () => {
    it('when before and afterReturn and after are provided then call before then call raw then call afterReturn then call after', () => {
        const srcFn = jest.fn();
        const beforeCallback = jest.fn();
        const afterReturnCallback = jest.fn();
        const afterCallback = jest.fn();

        let decorated = decorate(srcFn, {
            before: beforeCallback,
            afterReturn: afterReturnCallback,
            after: afterCallback
        });

        decorated(100, 200);
        expect(beforeCallback).toBeCalledTimes(1);
        expect(srcFn).toBeCalledTimes(1);
        expect(afterReturnCallback).toBeCalledTimes(1);
        expect(afterCallback).toBeCalledTimes(1);
    });

    it("when afterReturn is provided then return the afterReturn's return", () => {
        const srcFn = jest.fn().mockReturnValue({srcName: 'srcFn.name'});
        let decorated = decorate(srcFn, {
            afterReturn(rawReturn) {
                return {
                    ...rawReturn,
                    afterReturnName: 'afterReturn.name'
                };
            }
        });
        const finalReturn = decorated(100, 200);
        expect(finalReturn).toStrictEqual({srcName: 'srcFn.name', afterReturnName: 'afterReturn.name'});
    });

    it("when after is provided then return the srcFn's return", () => {
        const srcFn = jest.fn().mockReturnValue({srcName: 'srcFn.name'});
        let decorated = decorate(srcFn, {
            after(rawReturn) {
                return {
                    ...rawReturn,
                    afterName: 'after.name'
                };
            }
        });
        const finalReturn = decorated(100, 200);
        expect(finalReturn).toStrictEqual({
            srcName: 'srcFn.name'
        });
    });

    it("when afterReturn and after are provided then return the afterReturn's return", () => {
        const srcFn = jest.fn().mockReturnValue({srcName: 'srcFn.name'});
        let decorated = decorate(srcFn, {
            afterReturn(rawReturn) {
                return {
                    ...rawReturn,
                    afterReturnName: 'afterReturn.name'
                };
            },
            after(rawReturn) {
                return {
                    ...rawReturn,
                    afterName: 'after.name'
                };
            }
        });
        const finalReturn = decorated(100, 200);
        expect(finalReturn).toStrictEqual({
            srcName: 'srcFn.name',
            afterReturnName: 'afterReturn.name'
        });
    });

    it('when chain-decorate then chain call', () => {
        const result = [];

        function pushArgument() {
            result.push(...arguments);
        }

        const srcFn = pushArgument;
        const beforeCallback = pushArgument;
        const afterReturnCallback = pushArgument;

        const decorated = decorate(srcFn, {
            before(a, b) {
                beforeCallback(1, a, b);
            },
            afterReturn(rawReturn, a, b) {
                afterReturnCallback(2, a, b);
            }
        }).decorate({
            before(a, b) {
                beforeCallback(3, a, b);
            },
            afterReturn(rawReturn, a, b) {
                afterReturnCallback(4, a, b);
            }
        });
        decorated(100, 200);

        expect(result).toEqual([
            3, 100, 200,
            1, 100, 200,
            100, 200,
            2, 100, 200,
            4, 100, 200]
        );
    });

    it('when decorate with default context then use default context', () => {
        global.extra = 'global.extra';

        const rawFn = jest.fn();
        const beforeCallback = jest.fn();
        const afterReturnCallback = jest.fn();

        function srcFn(a, b) {
            rawFn(this.extra, a, b);
        }

        srcFn.extra = 'fn.extra';
        const decorated = decorate(srcFn, {
            before(a, b) {
                beforeCallback(this.extra, a, b);
            },
            afterReturn(res, a, b) {
                afterReturnCallback(this.extra, a, b);
            }
        });
        decorated(100, 200);

        expect(beforeCallback.mock.calls[0]).toEqual(['global.extra', 100, 200]);
        expect(rawFn.mock.calls[0]).toEqual(['global.extra', 100, 200]);
        expect(afterReturnCallback.mock.calls[0]).toEqual(['global.extra', 100, 200]);
    });

    it('when decorate with extra context then use extra context', () => {
        global.extra = 'global.extra';

        const rawFn = jest.fn();
        const beforeCallback = jest.fn();
        const afterReturnCallback = jest.fn();

        function fn(a, b) {
            rawFn(this.name, a, b);
        }

        fn.name = 'fn.extra';

        const thisArg = {
            name: 'param.extra'
        };
        const decorated = decorate(fn, {
            before(a, b) {
                beforeCallback(this.name, a, b);
            },
            afterReturn(res, a, b) {
                afterReturnCallback(this.name, a, b);
            }
        }, thisArg);
        decorated(100, 200);

        expect(beforeCallback.mock.calls[0]).toEqual(['param.extra', 100, 200]);
        expect(rawFn.mock.calls[0]).toEqual(['param.extra', 100, 200]);
        expect(afterReturnCallback.mock.calls[0]).toEqual(['param.extra', 100, 200]);
    });

    it('when raw-function throw error and afterThrow intercept error then after is called', () => {
        const afterThrowCallback = jest.fn().mockReturnValue(true);
        const afterCallback = jest.fn();

        function rawFn() {
            throw {msg: 'rawFn.error'};
        }

        const decorated = decorate(rawFn, {
            afterThrow: afterThrowCallback,
            after: afterCallback
        });
        decorated(100, 200);
        expect(afterThrowCallback).toBeCalled();
        expect(afterThrowCallback.mock.calls[0][0]).toStrictEqual({msg: 'rawFn.error'});
        expect(afterCallback).toBeCalled();
    });

    it('when raw-function throw error and afterThrow do not intercept error then after is not called', () => {
        const afterThrowCallback = jest.fn().mockReturnValue(false);
        const afterCallback = jest.fn();

        function rawFn() {
            throw {msg: 'rawFn.error'};
        }

        const decorated = decorate(rawFn, {
            afterThrow: afterThrowCallback,
            after: afterCallback
        });
        expect(() => {
            decorated(100, 200);
        }).toThrow();
        expect(afterThrowCallback).toBeCalled();
        expect(afterThrowCallback.mock.calls[0][0]).toStrictEqual({msg: 'rawFn.error'});
        expect(afterCallback).not.toBeCalled();
    });

    it('when before throw error then throw error and afterThrow is ignored', () => {
        const rawFn = jest.fn();
        const afterThrowCallback = jest.fn();

        function beforeCallback() {
            throw {msg: 'beforeCallback.error'};
        }

        const decorated = decorate(rawFn, {
            before: beforeCallback,
            afterThrow: afterThrowCallback
        });
        expect(() => {
            decorated(100, 200);
        }).toThrow();
        expect(rawFn).not.toBeCalled();
        expect(afterThrowCallback).not.toBeCalled();
    });

    it('when afterReturn throw error then throw error and afterThrow is ignored', () => {
        const rawFn = jest.fn();
        const afterThrowCallback = jest.fn();

        function afterReturnCallback() {
            throw {msg: 'afterReturnCallback.error'};
        }

        const decorated = decorate(rawFn, {
            afterReturn: afterReturnCallback,
            afterThrow: afterThrowCallback
        });
        expect(() => {
            decorated(100, 200);
        }).toThrow();
        expect(rawFn).toBeCalled();
        expect(afterThrowCallback).not.toBeCalled();
    });

    it('when after throw error then throw error and afterThrow is ignored', () => {
        const rawFn = jest.fn();
        const afterThrowCallback = jest.fn();

        function afterCallback() {
            throw {msg: 'afterCallback.error'};
        }

        const decorated = decorate(rawFn, {
            after: afterCallback,
            afterThrow: afterThrowCallback
        });
        expect(() => {
            decorated(100, 200);
        }).toThrow();
        expect(rawFn).toBeCalled();
        expect(afterThrowCallback).not.toBeCalled();
    });
});