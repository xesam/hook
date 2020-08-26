function Page(option) {
    const query = {
        name: '_page'
    };
    option.onLoad(query);
    option.onShow();
    option.onUnload();
}

Page.__name = 'page';

module.exports = Page;