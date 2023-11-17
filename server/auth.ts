import { IncomingMessage, ServerResponse } from "http";
import { registerUser, findUsers, createGroup, createSession, checkSession, deleteSession } from "./postgresqlDB.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';

export async function handleAPI(request: IncomingMessage, response: ServerResponse): Promise<void> {

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


    if (url === '/auth/login') {

      // check that email exists in DB
          console.log('auth login: ', bodyJSON);
      const searchResults = findUsers(bodyJSON.email);
      searchResults
        .then((returnedValue) => {
          console.log('auth login: ', returnedValue);

          // check pass
          bcrypt.compare(bodyJSON.password, returnedValue.password as any).then(function(result) {

            // correct pass
            if (result) {

              const logoutSession = async (id: number) => {
                const exists = await checkSession('',id);
                if (exists) await deleteSession(id);
              }
              //delete previous session if exists
              logoutSession(returnedValue.id);

              //create accessToken for login
              const accessToken = jwt.sign(
                { 'email': bodyJSON.email }, 
                process.env.JWT_PASSWORD_ACCESS as jwt.Secret,
                { expiresIn: '30m' }
              );
              //create refreshToken for a session
              const refreshToken = jwt.sign(
                { 'email': bodyJSON.email }, 
                process.env.JWT_PASSWORD_REFRESH as jwt.Secret,
                { expiresIn: '1d' }
              );

              // store session
              const session = createSession(refreshToken, returnedValue.id);

              console.log('refreshToken: ', refreshToken);
              // send cookie
              response.writeHead(201, { 
                'Content-Type': 'text/plain',
                'ok': 'true',
                'message': 'successful insertion',
                'Set-Cookie': `id=${refreshToken}; Path=/; HttpOnly; Max-Age="${24 * 60 * 60 * 1000}"; Secure`
              });
              ////Secure; HttpOnly; SameSite=None; Path=/; Domain=localhost:3300
              response.end(JSON.stringify(accessToken));


//              const userDataFromDB = { 
//                name: returnedValue.name, 
//                email: returnedValue.email,
//                id: returnedValue.id,
//                groups: returnedValue.groups,
//                token: ''
//              };
//              const token = jwt.sign(
//                userDataFromDB, 
//                process.env.JWT_PASSWORD as jwt.Secret,
//                { expiresIn: '1hr' }
//              );
//              userDataFromDB.token = token;

              return 0;

            }

            //bad credentials
            response.writeHead(403, { 
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
            createGroup(returnedValue.id, userLogInData.name);
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
          .writeHead(401, { 
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



            
