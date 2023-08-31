import * as http from 'http';
import * as path from 'path';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import EventEmitter from 'events';

const serverHit = new EventEmitter();
const PORT: number | string = process.env.PORT || 3300;
let serverHits: number = 0;

const serveFile = async (filePath: string, contentType: string, httpResponse: http.ServerResponse): Promise<void> => {
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

serverHit.on('hit', (request: http.IncomingMessage) => {
  console.log('hit');
  const time = new Date();
  fs.appendFileSync(path.join(__dirname, '..', 'log.txt'),
  `host: ${request.headers.host}\turl: ${request.url}\tmethod: ${request.method}\tdate: ${time}\n`);
});

const parseRequest = (request: http.IncomingMessage, response: http.ServerResponse): void => {
//  console.log(`hit number: ${serverHits}, ${request.url} ${request.method}`);
  serverHits++;

  serverHit.emit('hit', request);

  if (request.url) {
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
                  : path.join(__dirname, '..', '..', 'client', request.url);

        //  in case we add a bunch of paths, this will tack html on the end
    if (!extension && request.url?.slice(-1) !== '/') filePath += '.html';

//    console.log('check file path', filePath);
    // check if file exists
    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
      // serve file
//      console.log(`congrats, we will serve the file: ${filePath}`);
      serveFile(filePath, contentType, response);

    } else {
//      console.log(`file didn't exist`);
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
          //serve a 404
//          console.log('trouble at the mill');
//          serveFile(path.join(__dirname, 'src', 'views', '404.html'), 'text/html', response);
      };
    };

//    console.log(`line 94: contentType: ${contentType}, extension: ${extension}, filePath ${filePath}, request.url: ${request.url}`);
  }
} 

const server = http.createServer(parseRequest);
server.listen(PORT, () => console.log(`server is running on ${PORT}`));
