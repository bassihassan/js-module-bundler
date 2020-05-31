(function () {
    let modules = {
        ['../webapp/main.js']: function (require, exports) {
            "use strict";

            var _a = _interopRequireDefault(require("./a.js"));

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {"default": obj};
            }

            console.log("----- main start ------");
            console.table({
                a: _a["default"],
                b: _a["default"]
            });
            console.log("-----  main end  ------");
        }, ['./a.js']: function (require, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports["default"] = void 0;
            var _default = "module a";
            exports["default"] = _default;
            console.log("module a invoked");
        }, ['./a.js']: function (require, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports["default"] = void 0;
            var _default = "module a";
            exports["default"] = _default;
            console.log("module a invoked");
        },
    };
    let cache = {};

    function require(module) {
        let exports = {};
        if (!cache[module]) {
            modules[module](require, exports);
            cache[module] = exports;
            return exports;
        } else {
            return cache[module];
        }
    }

    (modules['../webapp/main.js'])(require, {})
})();
