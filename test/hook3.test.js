const hook = require('../src/index').hook_obj_names;
const Page = require('./Page')

describe('hook obj names', () => {
    it('simple', () => {
        const targetCallback = jest.fn();
        const beforeCallback = jest.fn();
        const afterCallback = jest.fn();

        const option = {
            id: 1,
            onLoad(query) {
                targetCallback(query);
            },
            onShow() {
                targetCallback(this.id);
            },
            onUnload() {
                targetCallback();
            },
        };

        const opt2 = hook(option, ['onLoad', 'onShow', 'onUnload'], {
            id: 2,
            before() {
                beforeCallback(this.id);
            },
            after() {
                afterCallback(this.id);
            }
        });

        const opt3 = hook(opt2, ['onLoad'], {
            id: 3,
            before() {
                beforeCallback(this.id);
            },
            after() {
                afterCallback(this.id);
            }
        });
        Page(opt3);

        expect(targetCallback.mock.calls.length).toBe(3);
        expect(beforeCallback.mock.calls.length).toBe(4);
        expect(afterCallback.mock.calls.length).toBe(4);
    })
});