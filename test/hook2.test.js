const hook = require('../src/index').hook_obj;

describe('hook object', () => {
    it('hook nothing', () => {
        const onLoadCallback = jest.fn();
        const onShowCallback = jest.fn();

        const target = {
            data: {
                name: 'hook'
            },
            onLoad(query) {
                onLoadCallback(query, this.data);
            },
            onShow() {
                onShowCallback(this.data);
            }
        };

        const hooked2 = hook(target);

        hooked2.onLoad({id: '123'});
        expect(onLoadCallback).toBeCalled();
        expect(onShowCallback).not.toBeCalled();
        expect(onLoadCallback.mock.calls[0][0]).toEqual({
            id: '123'
        });
        expect(onLoadCallback.mock.calls[0][1]).toEqual({
            name: 'hook'
        });

        hooked2.onShow();
        expect(onLoadCallback).toBeCalled();
        expect(onShowCallback).toBeCalled();
        expect(onShowCallback.mock.calls[0][0]).toEqual({
            name: 'hook'
        });
    });

    it('hook simple', () => {
        const onLoad = jest.fn();
        const onShow = jest.fn();
        const obj = {
            data: {
                name: 'hook'
            },
            onLoad: onLoad,
            onShow: onShow
        };

        const onLoadCallback = jest.fn();
        const onShowCallback = jest.fn();
        const hooked2 = hook(obj, {
            onLoad() {
                return {
                    id: 100,
                    before() {
                        onLoadCallback('before', this.id);
                    },
                    after() {
                        onLoadCallback('after', this.id);
                    }
                };
            },

            onShow() {
                return {
                    id: 100,
                    before() {
                        onShowCallback('before', this.id);
                    },
                    after() {
                        onShowCallback('after', this.id);
                    }
                };
            }
        });

        const hooked3 = hook(hooked2, {
            onLoad() {
                return {
                    id: 200,
                    before() {
                        onLoadCallback('before', this.id);
                    },
                    after() {
                        onLoadCallback('after', this.id);
                    }
                };
            },

            onShow() {
                return {
                    id: 200,
                    before() {
                        onShowCallback('before', this.id);
                    },
                    after() {
                        onShowCallback('after', this.id);
                    }
                };
            }
        });

        hooked3.onLoad({id: '123'});
        expect(onLoad).toBeCalled();
        expect(onShow).not.toBeCalled();

        expect(onLoadCallback.mock.calls[0]).toEqual(['before', 200]);
        expect(onLoadCallback.mock.calls[1]).toEqual(['before', 100]);
        expect(onLoadCallback.mock.calls[2]).toEqual(['after', 100]);
        expect(onLoadCallback.mock.calls[3]).toEqual(['after', 200]);

        hooked3.onShow();
        expect(onLoad).toBeCalled();
        expect(onShow).toBeCalled();

        expect(onShowCallback.mock.calls[0]).toEqual(['before', 200]);
        expect(onShowCallback.mock.calls[1]).toEqual(['before', 100]);
        expect(onShowCallback.mock.calls[2]).toEqual(['after', 100]);
        expect(onShowCallback.mock.calls[3]).toEqual(['after', 200]);
    })
});

