import { IncomingMessage, ServerResponse } from "http";
import { registerUser, findUsers } from "./postgresqlDB";
import bcrypt from 'bcrypt';
import { QueryResultRow } from "pg";


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

    // if there is no body
    if (body.length === 0) {
      response.end('you didn\'t send anything');
      return 0;
    }


    bodyString = Buffer.concat(body).toString();
    bodyJSON = JSON.parse(bodyString);
    console.log('server auth',request.url, bodyJSON);

    if (request.url === '/auth/login') {

      const searchResults = findUsers(bodyJSON.email);
      searchResults
        .then((returnedValue) => {
          console.log(returnedValue);
          console.log('hi');
          if (returnedValue === undefined) {
            throw new Error('this email/password combination does not exist')
          };
          bcrypt.compare(bodyJSON.password, returnedValue.password as any).then(function(result) {
            console.log('bcrypt', result);
            response.writeHead(200, { 
              'Content-Type': 'text/plain', 
              'ok': 'true',
              'message': 'successful login'
            })
            response.end('successful login\n');
            return 0;
          });
        })
        .catch((error) => {
          console.log('log in error',error);
          response.writeHead(400, { 
            'Content-Type': 'text/plain', 
            'ok': 'false' 
          })
          .end('bad login credentials\n');
          return 0;
        });

    }

    // REGISTER USER
    if (request.url === '/auth/register' && request.method === 'POST') {

      // data validation
      if (!bodyJSON.email || !bodyJSON.password || !bodyJSON.name) {

        response.writeHead(400, { 
          'Content-Type': 'text/plain',
          'ok': 'false'
        });
        response.end('\nmust provide user name, password, and name');
        return 0;
      }

      const saltRounds = 10;
      bcrypt.hash(bodyJSON.password, saltRounds).then(function(hash) {
        let hashedPassword = hash;

        const userLogInData = {
          userName: bodyJSON.email,
          password: hashedPassword,
          name: bodyJSON.name
        }


        // check if user already exists
        const searchResults = findUsers(userLogInData.userName);
        searchResults.then((returnedValue) => {
          if (returnedValue !== undefined) {
            throw new Error('user already exists')
          };
          const dbResponse = registerUser(userLogInData.userName, userLogInData.name, userLogInData.password);
          dbResponse.then((returnedValue) => {
            response.writeHead(201, { 
              'Content-Type': 'text/plain',
              'ok': 'true'
            });
            response.write(JSON.stringify(returnedValue));
            response.end('\nsuccessful insertion!');
          });
        })
        .catch((error) => {
          console.log('catch statement', error);
          response
          .writeHead(400, { 
            'Content-Type': 'text/plain', 
            'ok': 'false' 
          })
          .end('invalid insertion\n');
        });

      });
    }
  });
}
