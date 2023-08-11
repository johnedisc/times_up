"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startScreen = void 0;
require("../css/container.css");
var main_js_1 = require("./main.js");
var startScreen = function () {
    var _a;
    (0, main_js_1.clearScreen)();
    var h1 = document.createElement('h1');
    var div = document.createElement('div');
    h1.innerHTML = 'OPEN';
    div.appendChild(h1);
    div.classList.add('flex-row', 'start-screen');
    (_a = document.querySelector('#container')) === null || _a === void 0 ? void 0 : _a.appendChild(div);
};
exports.startScreen = startScreen;
