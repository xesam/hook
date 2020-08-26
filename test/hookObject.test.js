const hook = require('../index');

describe('hook object', () => {
    it('hook nothing', () => {
        const onLoadCallback = jest.fn();
        const onShowCallback = jest.fn();

        const target = {
            data: {
                name: 'target'
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
        expect(onLoadCallback.mock.calls[0]).toEqual([{id: '123'}, {name: 'target'}]);

        hooked2.onShow();
        expect(onLoadCallback).toBeCalled();
        expect(onShowCallback).toBeCalled();
        expect(onShowCallback.mock.calls[0][0]).toEqual({name: 'target'});
    });

    it('hook object', () => {
        const onLoad = jest.fn();
        const onShow = jest.fn();
        const onLoadCallback = jest.fn();
        const onShowCallback = jest.fn();

        const obj = {
            name: 'target',
            onLoad: onLoad,
            onShow: onShow
        };
        const hooked2 = hook(obj, {
            onLoad() {
                return {
                    before(query) {
                        onLoadCallback('before', this.name, query.name);
                    },
                    after(query) {
                        onLoadCallback('after', this.name, query.name);
                    }
                };
            },

            onShow() {
                return {
                    before() {
                        onShowCallback('before', this.name);
                    },
                    after() {
                        onShowCallback('after', this.name);
                    }
                };
            }
        });

        hooked2.onLoad({name: 'hook'});
        expect(onLoad.mock.calls[0][0]).toEqual({
            name: 'hook'
        });
        expect(onShow).not.toBeCalled();

        expect(onLoadCallback.mock.calls[0]).toEqual(['before', 'target', 'hook']);
        expect(onLoadCallback.mock.calls[1]).toEqual(['after', 'target', 'hook']);

        hooked2.onShow();

        expect(onShowCallback.mock.calls[0]).toEqual(['before', 'target']);
        expect(onShowCallback.mock.calls[1]).toEqual(['after', 'target']);
    })

    it('hook object connect', () => {
        const onLoad = jest.fn();
        const onShow = jest.fn();
        const onLoadCallback = jest.fn();
        const onShowCallback = jest.fn();

        const obj = {
            name: 'target',
            onLoad: onLoad,
            onShow: onShow
        };
        const hooked2 = hook(obj, {
            onLoad() {
                return {
                    before(query) {
                        onLoadCallback('before1', this.name, query.name);
                    },
                    after(query) {
                        onLoadCallback('after1', this.name, query.name);
                    }
                };
            },

            onShow() {
                return {
                    before() {
                        onShowCallback('before1', this.name);
                    },
                    after() {
                        onShowCallback('after1', this.name);
                    }
                };
            }
        });

        const hooked3 = hook(hooked2, {
            onLoad() {
                return {
                    before(query) {
                        onLoadCallback('before2', this.name, query.name);
                    },
                    after(query) {
                        onLoadCallback('after2', this.name, query.name);
                    }
                };
            },

            onShow() {
                return {
                    before() {
                        onShowCallback('before2', this.name);
                    },
                    after() {
                        onShowCallback('after2', this.name);
                    }
                };
            }
        });

        hooked3.onLoad({name: 'hook'});
        expect(onLoad.mock.calls[0][0]).toEqual({
            name: 'hook'
        });
        expect(onShow).not.toBeCalled();

        expect(onLoadCallback.mock.calls[0]).toEqual(['before2', 'target', 'hook']);
        expect(onLoadCallback.mock.calls[1]).toEqual(['before1', 'target', 'hook']);
        expect(onLoadCallback.mock.calls[2]).toEqual(['after1', 'target', 'hook']);
        expect(onLoadCallback.mock.calls[3]).toEqual(['after2', 'target', 'hook']);

        hooked3.onShow();

        expect(onShowCallback.mock.calls[0]).toEqual(['before2', 'target']);
        expect(onShowCallback.mock.calls[1]).toEqual(['before1', 'target']);
        expect(onShowCallback.mock.calls[2]).toEqual(['after1', 'target']);
        expect(onShowCallback.mock.calls[3]).toEqual(['after2', 'target']);
    })
});

