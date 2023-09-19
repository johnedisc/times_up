
export const serverHit.on('hit', (request: IncomingMessage) => {
  const time = new Date();
  fs.appendFileSync(path.join(__dirname, '..', 'log.txt'),
  `host: ${request.headers.host}\turl: ${request.url}\n\tmethod: ${request.method}\n\tdate: ${time}\n`);
});

