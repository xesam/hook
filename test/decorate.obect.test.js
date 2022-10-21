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

    it("when after is provided then return the after's return", () => {
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
            srcName: 'srcFn.name',
            afterName: 'after.name'
        });
    });

    it("when afterReturn and after are provided then return the after's return", () => {
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
            afterReturnName: 'afterReturn.name',
            afterName: 'after.name'
        });
    });

    it("when after is provided then return the after's return", () => {
        const srcFn = jest.fn().mockReturnValue({rawKey: 'rawValue'});
        const afterCallback = jest.fn().mockReturnValue({afterKey: 'afterValue'});

        let decorated = decorate(srcFn, {
            after(rawReturn, a, b) {
                const afterReturn = afterCallback(a, b);
                return {
                    ...rawReturn,
                    ...afterReturn
                };
            }
        });
        const finalReturn = decorated(100, 200);
        expect(finalReturn).toStrictEqual({rawKey: 'rawValue', afterKey: 'afterValue'});
    });

    it('when chain-decorate then chain call', () => {
        const result = [];

        function pushArgument() {
            result.push(...arguments);
        }

        const srcFn = pushArgument;
        const beforeCallback = pushArgument;
        const afterCallback = pushArgument;

        const decorated = decorate(srcFn, {
            before(a, b) {
                beforeCallback(1, a, b);
            },
            after(rawReturn, a, b) {
                afterCallback(2, a, b);
            }
        }).decorate({
            before(a, b) {
                beforeCallback(3, a, b);
            },
            after(rawReturn, a, b) {
                afterCallback(4, a, b);
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
        const afterCallback = jest.fn();

        function srcFn(a, b) {
            rawFn(this.extra, a, b);
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
        expect(rawFn.mock.calls[0]).toEqual(['global.extra', 100, 200]);
        expect(afterCallback.mock.calls[0]).toEqual(['global.extra', 100, 200]);
    });

    it('when decorate with extra context then use extra context', () => {
        global.extra = 'global.extra';

        const rawFn = jest.fn();
        const beforeCallback = jest.fn();
        const afterCallback = jest.fn();

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
            after(res, a, b) {
                afterCallback(this.name, a, b);
            }
        }, thisArg);
        decorated(100, 200);

        expect(beforeCallback.mock.calls[0]).toEqual(['param.extra', 100, 200]);
        expect(rawFn.mock.calls[0]).toEqual(['param.extra', 100, 200]);
        expect(afterCallback.mock.calls[0]).toEqual(['param.extra', 100, 200]);
    });

    it('when raw-function throw error then before is called then afterThrow is called then after is called', () => {
        const afterCallback = jest.fn();
        const afterThrowCallback = jest.fn();

        function rawFn() {
            throw {msg: 'rawFn.error'};
        }

        const decorated = decorate(rawFn, {
            after: afterCallback,
            afterThrow: afterThrowCallback
        });
        decorated(100, 200);
        expect(afterThrowCallback).toBeCalled();
        expect(afterThrowCallback.mock.calls[0][0]).toStrictEqual({msg: 'rawFn.error'});
        expect(afterCallback).toBeCalled();
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
});