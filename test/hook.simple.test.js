const hook = require('../index');

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