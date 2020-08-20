function Page(option) {
    const query = {
        id: '123456'
    };
    option.onLoad(query);
    option.onShow();
    option.onUnload();
}

module.exports = Page;