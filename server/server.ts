import * as http from 'http';
import * as path from 'path';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import EventEmitter from 'events';
import { IncomingMessage, ServerResponse } from 'http';
import { handleAPI } from './auth.js';
import { programs } from './programs.js';
import * as dotenv from 'dotenv';
dotenv.config();

export const serverHit = new EventEmitter();
const PORT: number | string = process.env.PORT || 3300;

//const certs = {
//  key: fs.readFileSync('/etc/ssl/sslTime/privateKey.pem'),
//  cert: fs.readFileSync('/etc/ssl/sslTime/originCert.pem'),
//};
//const certs = {
//  key: fs.readFileSync('/etc/ssl/sslTime/timesup.test.key'),
//  cert: fs.readFileSync('/etc/ssl/sslTime/timesup.test.crt'),
//  passphrase: 'Priknedis'
//};

const serveFile = async (filePath: string, contentType: string, httpResponse: any): Promise<void> => {
//  console.log('line 10', filePath, contentType);
  try {
    const data = await fsPromises.readFile(filePath, 'utf8');
    httpResponse.writeHead(200, { 'Content-Type': contentType });
    httpResponse.end(data);
  } catch (error) {
    console.log(error);
    httpResponse.statusCode = 500;
    httpResponse.end();
  }
}

const parseRequest = (request: IncomingMessage, response: ServerResponse): void => {
  if (request.url?.includes('auth')) console.log('parse req: ', request.url);

  serverHit.emit('hit', request);

  if (request.url?.includes('auth')) {
    handleAPI(request, response);
    return;
  } else if (request.url?.includes('program') || request.url?.includes('intervalName')) {
    programs(request, response);
    return;
  } else if (request.url) {
    const extension: any  = path.extname(request.url);
    let contentType: string;

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
      case '.ico':
        contentType = 'image/x-icon';
      break;
      default:
        contentType = 'text/html';
    }

    let filePath = 
      contentType === 'text/html' && request.url === '/'
        ? path.join(__dirname, '..', '..', 'client', 'index.html')
          : contentType === 'text/html' && request.url === '/index.html'
            ? path.join(__dirname, '..', '..', 'client', 'index.html')
              : contentType === 'text/css'
                ? path.join(__dirname, '..', '..', 'client', 'src', 'css', path.basename(request.url))
                  : contentType === 'image/x-icon'
                    ? path.join(__dirname, '..', '..', 'client', path.basename(request.url))
                      : path.join(__dirname, '..', '..', 'client', request.url);

    console.log('server.ts ', filePath);

    // ensures spa won't try to reload to the current spot
    if (!extension && request.url?.slice(-1) !== '/') {
      filePath = path.join(__dirname, '..', '..', 'client', 'index.html');
    }

//    console.log(filePath);
    // check if file exists
    let fileExists = fs.existsSync(filePath);


    if (fileExists) {
      // serve file
      serveFile(filePath, contentType, response);

    } else {
      // 301 redirect
      switch(path.parse(filePath).base) {
        case 'unused-url.html':
          response.writeHead(301, { 'Location': '/index.html' });
          response.end();
          break;
        case 'www-something.html':
          response.writeHead(301, { 'Location': '/' });
          response.end();
          break;
        default:
////          serve a 404
          console.log('trouble at the mill', request.url);
//          serveFile(path.join(__dirname, '..', '..', 'client', 'src', '404.html'), 'text/html', response);
      };
    };
  }
} 

const server = http.createServer(parseRequest);
server.listen(PORT, () => console.log(`server is running on ${PORT}`));
