const hook = require('../index');

describe('hook object', () => {
    it('nothing', () => {
        const onLoadCallback = jest.fn();

        const target = {
            data: {
                name: 'target'
            },
            onLoad(query) {
                onLoadCallback(query, this.data);
            }
        };

        const hooked2 = hook(target);
        hooked2.onLoad({id: '123'});

        expect(onLoadCallback).toBeCalled();
        expect(onLoadCallback.mock.calls[0]).toEqual([{id: '123'}, {name: 'target'}]);
    });

    it('normal object', () => {
        const onLoad = jest.fn();
        const onLoadCallback = jest.fn();

        const obj = {
            name: 'target',
            onLoad: onLoad
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
            }
        });

        hooked2.onLoad({name: 'hook'});
        expect(onLoad.mock.calls[0][0]).toEqual({
            name: 'hook'
        });

        expect(onLoadCallback.mock.calls[0]).toEqual(['before', 'target', 'hook']);
        expect(onLoadCallback.mock.calls[1]).toEqual(['after', 'target', 'hook']);
    })

    it('none exist object key', () => {
        const onLoadCallback = jest.fn();
        const obj = {
            name: 'target'
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
            }
        });

        hooked2.onLoad({name: 'hook'});

        expect(onLoadCallback.mock.calls[0]).toEqual(['before', 'target', 'hook']);
        expect(onLoadCallback.mock.calls[1]).toEqual(['after', 'target', 'hook']);
    })

    it('hook chain', () => {
        const onLoad = jest.fn();
        const onLoadCallback = jest.fn();

        const obj = {
            name: 'target',
            onLoad: onLoad
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
            }
        });

        hooked3.onLoad({name: 'hook'});
        expect(onLoad.mock.calls[0][0]).toEqual({
            name: 'hook'
        });

        expect(onLoadCallback.mock.calls[0]).toEqual(['before2', 'target', 'hook']);
        expect(onLoadCallback.mock.calls[1]).toEqual(['before1', 'target', 'hook']);
        expect(onLoadCallback.mock.calls[2]).toEqual(['after1', 'target', 'hook']);
        expect(onLoadCallback.mock.calls[3]).toEqual(['after2', 'target', 'hook']);
    })
});

