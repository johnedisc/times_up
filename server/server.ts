import * as http from 'http';
import * as path from 'path';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import EventEmitter from 'events';
import { IncomingMessage, ServerResponse } from 'http';
import { programsRoute } from './controllers/programs.js';
import * as dotenv from 'dotenv';
import { userRoute } from './controllers/users.js';
import { verification } from './services/verify.js';
dotenv.config();

export const serverHit = new EventEmitter();
const PORT: number | string = process.env.PORT || 3500;

//const certs = {
//  key: fs.readFileSync('/etc/ssl/sslTime/privateKey.pem'),
//  cert: fs.readFileSync('/etc/ssl/sslTime/originCert.pem'),
//};
//const certs = {
//  key: fs.readFileSync('/etc/ssl/sslTime/timesup.test.key'),
//  cert: fs.readFileSync('/etc/ssl/sslTime/timesup.test.crt')
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

function serveStaticFiles(request: IncomingMessage, response: ServerResponse) {
  if (typeof request.url !== 'string') {
    response.writeHead(301, { 'Location': '/' });
    response.end();
    return;
  }

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

    // ensures spa won't try to reload to the current spot
    if (!extension && request.url?.slice(-1) !== '/') {
      filePath = path.join(__dirname, '..', '..', 'client', 'index.html');
    }

    if (fs.existsSync(filePath)) {
      // serve file
      serveFile(filePath, contentType, response);
    } else {
      // 301 redirect
      switch(path.parse(filePath).base) {
        case '':
          response.writeHead(301, { 'Location': '/' });
        response.end();
        break;
      };
    };
}

export interface IncomingMessageWithBody extends IncomingMessage {
  body: any;
}

const parseRequest = async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
  console.log(request.url);
  // log it
  serverHit.emit('hit', request);

  // initialize the request body stream variables
  let body:any = [];
  let bodyString:string;
  let bodyJSON:any;

  // parse out the request info
  const { headers, method, url } = request;

  request
  .on('error', err => {
    console.error('request error', err);
  })
  .on('data', chunk => {
    body.push(chunk);
  })
  .on('end', async () => {

    if (body.length > 0) {
      // parse out the body from string to JS object
      bodyString = Buffer.concat(body).toString();
      bodyJSON = JSON.parse(bodyString);
      console.log('body', bodyJSON);
    }

    if (request.url?.includes('programs') || request.url?.includes('intervalName')) {
      const refreshId = await verification(request, response);
      if (refreshId) {
        bodyJSON.id = refreshId;
        programsRoute(bodyJSON, request, response);
      }
//    } else if (request.url?.includes('auth')) {
//      handleAPI(bodyJSON, request, response);
//      console.log('auth');
    } else if (request.url?.includes('/users')) {
      if (request.url?.includes('/register') || request.url?.includes('/auth')) {
        userRoute(bodyJSON, request, response);
      } else {
        const refreshId = await verification(request, response);
        console.log('refreshId', refreshId);
        if (refreshId !== undefined) {
          bodyJSON.id = refreshId;
          userRoute(bodyJSON, request, response);
        }
      }
    } else if (request.url) {
      serveStaticFiles(request, response);
      return;
    }
  });

} 

const server = http.createServer(parseRequest);

server.listen(PORT, () => console.log(`server is running on ${PORT}`));
