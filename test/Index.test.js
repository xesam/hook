const HookPage = require('./HookPage');

describe('test HookPage', () => {
    it('simple', () => {
        const onLoad = jest.fn();
        const onShow = jest.fn();
        const onUnload = jest.fn();
        const onLoadCallback = jest.fn();

        const _HookPage = new HookPage();
        _HookPage.add({
            onLoad() {
                const id = 1;
                return {
                    before(query) {
                        onLoadCallback('before1', this.name, query.name, id);
                    },
                    after(query) {
                        onLoadCallback('after1', this.name, query.name, id);
                    }
                }
            }
        }).add({
            onLoad() {
                const id = 2;
                return {
                    before(query) {
                        onLoadCallback('before2', this.name, query.name, id);
                    },
                    after(query) {
                        onLoadCallback('after2', this.name, query.name, id);
                    }
                }
            }
        });

        _HookPage.Page({
            name: 'page',
            onLoad(query) {
                onLoad(this.name, query.name);
            },

            onShow() {
                onShow();
            },

            onUnload() {
                onUnload();
            }
        });

        expect(onLoad).toBeCalled();
        expect(onShow).toBeCalled();
        expect(onUnload).toBeCalled();

        expect(onLoadCallback.mock.calls[0]).toEqual(['before2', 'page', '_page', 2]);
        expect(onLoadCallback.mock.calls[1]).toEqual(['before1', 'page', '_page', 1]);
        expect(onLoadCallback.mock.calls[2]).toEqual(['after1', 'page', '_page', 1]);
        expect(onLoadCallback.mock.calls[3]).toEqual(['after2', 'page', '_page', 2]);
    })
});