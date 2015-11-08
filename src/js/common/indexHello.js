define(function (require, exports) {
    exports.indexHello = function () {
        var template = require("./template");
        var indexHello = template.tmpl(require("./indexHello.tpl"))();
        $(".container").append(indexHello);
    };
});