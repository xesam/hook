function decorate(srcFn) {
    let wrapper = function (initOpts) {

    };
    wrapper.decorations = [];
    wrapper.add = function (decoration) {
        this.decorations.push(decoration);
        return this;
    };
    wrapper.before = function (decoration) {
        this.decorations.push({
            before: decoration
        });
        return this;
    };
    wrapper.after = function (decoration) {
        this.decorations.push({
            after: decoration
        });
        return this;
    };
    return wrapper;
}