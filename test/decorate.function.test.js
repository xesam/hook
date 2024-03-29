const decorate = require('../src/decorate');

describe('decorate function', () => {
    it('when decorate with null then return raw-function', () => {
        const srcFn = jest.fn();
        const decorated = decorate(srcFn);
        decorated(100, 200);
        expect(srcFn.mock.calls[0]).toEqual([100, 200]);
    });

    it('when decoration do not call raw-function then raw-function is ignore', () => {
        const srcFn = jest.fn();
        const testFn = jest.fn();
        const decorated = decorate(srcFn, function decoration(src, a, b) {
            testFn(a, b);
        });

        decorated(100, 200);
        expect(srcFn).toBeCalledTimes(0);
        expect(testFn).toBeCalledTimes(1);
        expect(testFn.mock.calls[0]).toEqual([100, 200]);
    });

    it('when decoration call raw-function then raw-function is called', () => {
        const srcFn = jest.fn();
        const beforeCallback = jest.fn();
        const afterCallback = jest.fn();
        let decorated = decorate(srcFn, function (src, a, b) {
            beforeCallback(1, a, b);
            src(2, a, b);
            afterCallback(3, a, b);
        });
        decorated(100, 200);

        expect(beforeCallback).toBeCalledTimes(1);
        expect(beforeCallback.mock.calls[0]).toEqual([1, 100, 200]);
        expect(srcFn).toBeCalledTimes(1);
        expect(srcFn.mock.calls[0]).toEqual([2, 100, 200]);
        expect(afterCallback).toBeCalledTimes(1);
        expect(afterCallback.mock.calls[0]).toEqual([3, 100, 200]);
    });

    it('when chain-decorate then chain call', () => {
        const result = [];

        function pushArgument() {
            result.push(...arguments);
        }

        const srcFn = pushArgument;
        const beforeCallback = pushArgument;
        const afterCallback = pushArgument;

        const decorated = decorate(srcFn, function (src, a, b) {
            beforeCallback(1, a, b);
            src(2, a, b);
            afterCallback(3, a, b);
        }).decorate(function (src, a, b) {
            beforeCallback(4, a, b);
            src(a, b);
            afterCallback(5, a, b);
        });
        decorated(100, 200);

        expect(result).toEqual([
            4, 100, 200,
            1, 100, 200,
            2, 100, 200,
            3, 100, 200,
            5, 100, 200]
        );
    });

    it('when decorate with default context then use default context', () => {
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

    it('when decorate with extra context then use extra context', () => {
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
});