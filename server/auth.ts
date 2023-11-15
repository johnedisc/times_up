import { IncomingMessage, ServerResponse } from "http";
import { registerUser, findUsers, createGroup, createSession, checkSession } from "./postgresqlDB.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { QueryResultRow } from "pg";
import { v4 as uuidv4 } from 'uuid';

export function handleAPI(request: IncomingMessage, response: ServerResponse): void {

  // initialize the request body stream variables
  let body:any = [];
  let bodyString:string;
  let bodyJSON:any;

  // parse out the request info
  const { headers, method, url } = request;
  console.log('auth: ', url, method);

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


    // parse out the body from string to JS object
    bodyString = Buffer.concat(body).toString(); 
    bodyJSON = JSON.parse(bodyString);
    const userId = bodyJSON.id;


    if (url === '/auth/login') {

      // check that email exists in DB
      const searchResults = findUsers(bodyJSON.email);
      searchResults
        .then((returnedValue) => {
          console.log('auth login: ', bodyJSON);
          console.log('auth login: ', returnedValue);

          // no exist 
          if (returnedValue === undefined) {
            throw new Error('log in error')
          };

          // exist
          bcrypt.compare(bodyJSON.password, returnedValue.password as any).then(function(result) {

            // email/password correct
            if (result) {

//              checkSession(returnedValue.id).then(thing => console.log('checkSession: ', thing));
              
              const session = createSession(uuidv4(), returnedValue.id);
              session
                .then((sessionData: any) => {
                  
                  console.log('auth session: ', sessionData);
                  response.on('error', err => {
                    console.error(err);
                  });

                  response.writeHead(200, { 
                    'Content-Type': 'application/json', 
                    'ok': 'true',
                    'message': 'successful login',
                    'Set-Cookie': `id=${sessionData.session_id}; Path=/`
                  });
//Secure; HttpOnly; SameSite=None; Path=/; Domain=localhost:3300

                  const userDataFromDB = { 
                    name: returnedValue.name, 
                    email: returnedValue.email,
                    id: returnedValue.id,
                    groups: returnedValue.groups,
                    token: ''
                  };
                  const token = jwt.sign(
                    userDataFromDB, 
                    process.env.JWT_PASSWORD as jwt.Secret,
                    { expiresIn: '1hr' }
                  );
                  userDataFromDB.token = token;

                  response.end(JSON.stringify(userDataFromDB));

                });

                return 0;

            }

            response.writeHead(401, { 
              'Content-Type': 'text/plain', 
              'ok': 'false',
              'message': 'bad login credentials'
            })
            .end('bad login credentials\n');
            return 0;

          });
        })
        .catch((error) => {
          console.log(error);
          response.writeHead(501, { 
            'Content-Type': 'text/plain', 
            'ok': 'false',
            'message': 'server error'
          })
          .end('server error');
          return 0;
        });

    }

    // REGISTER USER
    if (url === '/auth/register' && method === 'POST') {

      console.log('auth reg ', bodyJSON);
      // data validation
      if (!bodyJSON.email || !bodyJSON.password || !bodyJSON.name) {

        response.writeHead(201, { 
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
            const dbResponse2 = createGroup(returnedValue.id, userLogInData.name);
            dbResponse2.then((value) => {
            })
            response.writeHead(201, { 
              'Content-Type': 'text/plain',
              'ok': 'true',
              'message': 'successful insertion'
            });
            response.end();
          });
        })
        .catch((error) => {
          console.log('catch statement', error);
          response
          .writeHead(400, { 
            'Content-Type': 'text/plain', 
            'ok': 'false',
            'message': error
          })
          .end(error.toString());
        });

      });
    }
  });
}


