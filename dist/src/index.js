(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports"], function (require, exports) {
    function buildTDecorator(i18n) {
        return i18n.t;
    }
    function withMessagesFetch(i18n, fetchMessages) {
        return {
            t: buildTDecorator(i18n)
        };
    }
    exports.withMessagesFetch = withMessagesFetch;
});
