var buildStartScreen = function () {
    var _a;
    var h1 = document.createElement('h1');
    h1.innerHTML = 'OPEN';
    h1.classList.add('start-screen');
    (_a = document.querySelector('#container')) === null || _a === void 0 ? void 0 : _a.appendChild(h1);
};
window.addEventListener('load', function (event) {
    //  screen.orientation.lock("landscape");
    buildStartScreen();
});
