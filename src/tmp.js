

function _function(srcFn, decoration, thisArg) {
    let _$ = function () {
        const _this = thisArg || this;
        for (let hook of _$._hooks_) {
            if (hook.before) {
                hook.before.apply(_this, arguments);
            }
        }
        try {
            if (srcFn) {
                srcFn.apply(_this, arguments);
            }
        } catch (e) {
            if (decoration.afterThrow) {
                decoration.afterThrow.call(_this, e.message, arguments);
            } else {
                throw e;
            }
        } finally {
            for (let hook of _$._hooks_) {
                if (hook.after) {
                    hook.after.apply(_this, arguments);
                }
            }
        }
    };
    // if (decoration.name){
    //
    // }
    _$._src_ = srcFn._src_ ? [...srcFn._src_, srcFn.name] : [srcFn.name];
    _$._hooks_ = [];
    _$.add = function (dr) {
        this._hooks_.push(dr);
        return this;
    };
    _$.before = function () {
    };
    _$.after = function () {
    };
    _$.around = function (wrapper) {
        return function () {
            return wrapper.apply(srcFn, [srcFn, ...arguments]);
        };
    };
    _$.add(decoration);

    const s = _$.around(function (self) {
        console.log('before');
        const s = self();
        console.log('after');
        return s;
    });
    s(100, 200);
    return _$;
}
