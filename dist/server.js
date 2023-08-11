"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var path = require("path");
var fs = require("fs");
var fsPromises = require("fs/promises");
var PORT = process.env.PORT || 3300;
var serveFile = function (filePath, contentType, httpResponse) { return __awaiter(void 0, void 0, void 0, function () {
    var data, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, fsPromises.readFile(filePath, 'utf8')];
            case 1:
                data = _a.sent();
                httpResponse.writeHead(200, { 'Content-Type': contentType });
                httpResponse.end(data);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.log(error_1);
                httpResponse.statusCode = 500;
                httpResponse.end();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var server = http.createServer(function (request, response) {
    var _a;
    if (request.url) {
        console.log(request.url, request.method);
        var extension = path.extname(request.url);
        var contentType = void 0;
        switch (extension) {
            case '.css':
                contentType = 'text/css';
                break;
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.json':
                contentType = 'application/json';
                break;
            case '.jpg':
                contentType = 'image/jpeg';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.txt':
                contentType = 'text/plain';
                break;
            default:
                contentType = 'text/html';
        }
        var filePath = contentType === 'text/html' && request.url === '/'
            ? path.join(__dirname, '../src/views', 'index.html')
            : contentType === 'text/html' && request.url === '/index.html'
                ? path.join(__dirname, '../src/views', 'index.html')
                : path.join(__dirname, '..', request.url);
        //  in case we add a bunch of paths, this will tack html on the end
        if (!extension && ((_a = request.url) === null || _a === void 0 ? void 0 : _a.slice(-1)) !== '/')
            filePath += '.html';
        // check if file exists
        console.log('check filePath ' + filePath);
        var fileExists = fs.existsSync(filePath);
        if (fileExists) {
            // serve file
            console.log('congrats');
            serveFile(filePath, contentType, response);
        }
        else {
            // 301 redirect
            console.log('failure. 301 time');
            switch (path.parse(filePath).base) {
                case 'unused-url.html':
                    response.writeHead(301, { 'Location': '/index.html' });
                    response.end();
                    break;
                case 'www-something.html':
                    response.writeHead(301, { 'Location': '/' });
                    response.end();
                    break;
                default:
                    //serve a 404
                    serveFile(path.join(__dirname, '..', 'src', 'views', '404.html'), 'text/html', response);
            }
            ;
        }
        ;
        console.log("contentType: ".concat(contentType, ", extension: ").concat(extension, ", filePath ").concat(filePath, ", request.url: ").concat(request.url));
    }
});
server.listen(PORT, function () { return console.log("server is running on ".concat(PORT)); });
