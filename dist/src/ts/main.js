"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearScreen = void 0;
require("./css/container.css");
require("./css/root.css");
var start_screen_js_1 = require("./start-screen.js");
var clearScreen = function () {
    document.querySelector('#container').innerHTML = "";
};
exports.clearScreen = clearScreen;
window.addEventListener('load', function (event) {
    console.log(event);
    (0, start_screen_js_1.startScreen)();
});
