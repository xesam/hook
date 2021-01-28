const decorate = require('../src/decorate');

describe('decorate', () => {
    it('decorate empty', () => {
        const targetFn = jest.fn();
        const beforeCallback = jest.fn();

        const decorated = decorate(targetFn);
        decorated();
        expect(beforeCallback).not.toBeCalled();
        expect(targetFn).toBeCalled();
    });

    it('decorate function', () => {
        const targetFn = jest.fn();
        const beforeCallback = jest.fn();
        const afterCallback = jest.fn();

        let decorated = decorate(targetFn, function (src, a, b) {
            beforeCallback(a, b);
            src(a, b);
            afterCallback(a, b);
        });
        decorated(100, 200);

        expect(beforeCallback.mock.calls[0]).toEqual([100, 200]);
        expect(targetFn.mock.calls[0]).toEqual([100, 200]);
        expect(afterCallback.mock.calls[0]).toEqual([100, 200]);
    });

    it('decorate function this', () => {
        const targetFn = jest.fn();
        function fn(a, b) {
            targetFn(this.name, a, b);
        }
        fn.name = 'fn.name';
        const thisArg = {
            name: 'param.name'
        };
        const decorated = decorate(fn, function (src, a, b) {
            src(this.name, a, b);
        }, thisArg);
        decorated(100, 200);
        expect(targetFn.mock.calls[0]).toEqual(['param.name', 100, 200]);
    });
    //
    // it('decorate object', () => {
    //     const targetFn = jest.fn();
    //     const beforeCallback = jest.fn();
    //     const afterCallback = jest.fn();
    //
    //     function fn(a, b) {
    //         targetFn(this.name, a, b);
    //     }
    //
    //     const decorated = decorate(fn, {
    //         before() {
    //             beforeCallback();
    //         },
    //         after() {
    //             afterCallback();
    //         }
    //     });
    //     decorated(100, 200);
    //
    //     expect(beforeCallback.mock.calls[0][0]).toBe('arg this');
    //     expect(targetFn.mock.calls[0][0]).toBe('arg this');
    //     expect(targetFn.mock.calls[0][1]).toBe(100);
    //     expect(targetFn.mock.calls[0][2]).toBe(200);
    // });
    //
    // it('decorate object this', () => {
    //     const targetFn = jest.fn();
    //     const beforeCallback = jest.fn();
    //     const afterCallback = jest.fn();
    //
    //     function fn(a, b) {
    //         targetFn(this.name, a, b);
    //     }
    //
    //     const decorated = decorate(fn, {
    //         before() {
    //             beforeCallback(this.name);
    //         },
    //         after() {
    //             afterCallback(this.name);
    //         }
    //     }, {name: 'param.name'});
    //     decorated(100, 200);
    //
    //     expect(beforeCallback.mock.calls[0][0]).toBe('arg this');
    //     expect(targetFn.mock.calls[0][0]).toBe('arg this');
    //     expect(targetFn.mock.calls[0][1]).toBe(100);
    //     expect(targetFn.mock.calls[0][2]).toBe(200);
    // });
    //
    // it('decorate throw', () => {
    //     const beforeCallback = jest.fn();
    //     const afterCallback = jest.fn();
    //     const throwCallback = jest.fn();
    //
    //     function fn() {
    //         throw new Error();
    //     }
    //
    //     const hooked = hook(fn, {
    //         before() {
    //             beforeCallback();
    //         },
    //         after() {
    //             afterCallback();
    //         },
    //         afterThrow(e) {
    //             throwCallback(e);
    //         }
    //     });
    //     hooked();
    //     expect(beforeCallback).toBeCalled();
    //     expect(afterCallback).toBeCalled();
    //     expect(throwCallback).toBeCalled();
    // });
});