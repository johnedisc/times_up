"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const fsPromises = __importStar(require("fs/promises"));
const PORT = process.env.PORT || 3300;
let serverHits = 0;
const serveFile = (filePath, contentType, httpResponse) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('line 10', filePath, contentType);
    try {
        const data = yield fsPromises.readFile(filePath, 'utf8');
        httpResponse.writeHead(200, { 'Content-Type': contentType });
        httpResponse.end(data);
    }
    catch (error) {
        console.log(error);
        httpResponse.statusCode = 500;
        httpResponse.end();
    }
});
const server = http.createServer((request, response) => {
    var _a;
    console.log(`hit number: ${serverHits}, ${request.url} ${request.method}`);
    serverHits++;
    if (request.url) {
        const extension = path.extname(request.url);
        let contentType;
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
        let filePath = contentType === 'text/html' && request.url === '/'
            ? path.join(__dirname, '..', '..', 'client', 'index.html')
            : contentType === 'text/html' && request.url === '/index.html'
                ? path.join(__dirname, '..', '..', 'client', 'index.html')
                : contentType === 'text/css'
                    ? path.join(__dirname, '..', '..', 'client', 'src', 'css', path.basename(request.url))
                    : path.join(__dirname, '..', '..', 'client', request.url);
        //  in case we add a bunch of paths, this will tack html on the end
        if (!extension && ((_a = request.url) === null || _a === void 0 ? void 0 : _a.slice(-1)) !== '/')
            filePath += '.html';
        console.log('check file path', filePath);
        // check if file exists
        const fileExists = fs.existsSync(filePath);
        if (fileExists) {
            // serve file
            console.log(`congrats, we will serve the file: ${filePath}`);
            serveFile(filePath, contentType, response);
        }
        else {
            console.log(`file didn't exist`);
            // 301 redirect
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
                    console.log('trouble at the mill');
                //          serveFile(path.join(__dirname, 'src', 'views', '404.html'), 'text/html', response);
            }
            ;
        }
        ;
        //    console.log(`line 94: contentType: ${contentType}, extension: ${extension}, filePath ${filePath}, request.url: ${request.url}`);
    }
});
server.listen(PORT, () => console.log(`server is running on ${PORT}`));
//# sourceMappingURL=server.js.map