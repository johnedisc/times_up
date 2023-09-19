import { IncomingMessage, ServerResponse } from "http";
import { registerUser, findUsers } from "./postgresqlDB";


export function handleAPI(request: IncomingMessage, response: ServerResponse): void {
  let body:any = [];
  let bodyString:string;
  let bodyJSON:any;

  request
  .on('error', err => {
    console.error(err);
  })
  .on('data', chunk => {
    body.push(chunk);
  })
  .on('end', () => {
    bodyString = Buffer.concat(body).toString();
    bodyJSON = JSON.parse(bodyString);
    const userLogInData = {
      userName: bodyJSON.email,
      password: bodyJSON.password,
      name: bodyJSON.name
    }

    if (request.url === '/auth/register' && request.method === 'POST') {

      const searchResults = findUsers(userLogInData.userName);
      searchResults.then((returnedValue) => {
        if (returnedValue !== undefined) {
          throw new Error('user already exists')
        };
        const dbResponse = registerUser(userLogInData.userName, userLogInData.name, userLogInData.password);
        dbResponse.then((returnedValue) => {
          console.log('this is the reponse',returnedValue);
          response.writeHead(201, { 'Content-Type': 'text/plain' });
          response.write(JSON.stringify(returnedValue));
          response.end('\nsuccessful insertion!');
        });
      })
      .catch((error) => {
        console.log('catch statement', error);
        response.writeHead(418, { 'Content-Type': 'text/plain' });
        response.end('invalid insertion');
      });

    }
  });
}
