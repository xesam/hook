function Page(option) {
    const query = {
        name: 'page query'
    };
    option.onLoad(query);
    option.onShow();
    option.onUnload();
}

module.exports = Page;