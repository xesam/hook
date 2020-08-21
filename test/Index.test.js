const HookPage = require('./HookPage');

describe('HookPage', () => {
    it('simple', () => {
        const onLoadCallback = jest.fn();
        const onShowCallback = jest.fn();
        const onUnloadCallback = jest.fn();

        const _HookPage = new HookPage();
        _HookPage.add({
            onLoad() {
                return {
                    id: 1,
                    before(page, query) {
                        onLoadCallback('before', query.name, this.id);
                    },
                    after(page, query) {
                        onLoadCallback('after', query.name, this.id);
                    }
                }
            }
        }).add({
            onLoad() {
                return {
                    id: 2,
                    before(page, query) {
                        onLoadCallback('before', query.name, this.id);
                    },
                    after(page, query) {
                        onLoadCallback('after', query.name, this.id);
                    }
                }
            }
        });

        _HookPage.Page({
            onLoad(query) {
                onLoadCallback(query.name);
            },

            onShow() {
                onShowCallback();
            },

            onUnload() {
                onUnloadCallback();
            }
        });

        expect(onLoadCallback).toBeCalled();
        expect(onShowCallback).toBeCalled();
        expect(onUnloadCallback).toBeCalled();

        expect(onLoadCallback.mock.calls[0]).toEqual(['before', '_page', 2]);
        expect(onLoadCallback.mock.calls[1]).toEqual(['before', '_page', 1]);
        expect(onLoadCallback.mock.calls[2]).toEqual(['_page']);
        expect(onLoadCallback.mock.calls[3]).toEqual(['after', '_page', 1]);
        expect(onLoadCallback.mock.calls[4]).toEqual(['after', '_page', 2]);
    })
});