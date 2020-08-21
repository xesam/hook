const HookPage = require('./HookPage');

describe('simple hook function', () => {
    it('simple', () => {
        const onLoadCallback = jest.fn();
        const onShowCallback = jest.fn();
        const onUnloadCallback = jest.fn();
        HookPage({
            onLoad(query) {
                onLoadCallback(query);
                const a = null.length;
                onLoadCallback(query);
            },

            onShow() {
                onShowCallback();
            },

            onUnload() {
                onUnloadCallback();
            }
        });

        expect(onLoadCallback).toBeCalled();
        expect(onLoadCallback.mock.calls[0][0]).toEqual({
            id: '123456'
        });

        expect(onShowCallback).toBeCalled();
        expect(onUnloadCallback).toBeCalled();
    })
});