import * as http from 'http';
import * as path from 'path';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';


const PORT: number | string = process.env.PORT || 3300;

const serveFile = async (filePath, contentType, httpResponse) => {
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

const server = http.createServer((request, response) => {
  if (request.url) {
    console.log(request.url, request.method);

    const extension: any  = path.extname(request.url);

    let contentType: string;

    switch (extension) {
      case '.css':
        contentType = 'text/css';
      break;
      case '.ts':
        contentType = 'text/typescript';
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
        ? path.join(__dirname, 'src', 'views', 'index.html')
          : contentType === 'text/html' && request.url === '/index.html'
            ? path.join(__dirname, 'src', 'views', 'index.html')
              : path.join(__dirname, 'src/views', request.url);

        //  in case we add a bunch of paths, this will tack html on the end
    if (!extension && request.url?.slice(-1) !== '/') filePath += '.html';

    // check if file exists
    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
      // serve file
      console.log('congrats');
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
          //serve a 404
          serveFile(path.join(__dirname, 'src', 'views', '404.html'), 'text/html', response);
      };
    };

    console.log(`contentType: ${contentType}, extension: ${extension}, filePath ${filePath}, request.url: ${request.url}`);
  }
}); 

server.listen(PORT, () => console.log(`server is running on ${PORT}`));
