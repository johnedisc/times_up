import { IncomingMessage, ServerResponse } from "http";
import { registerUser, findUsers, createGroup, createSession, checkSession, deleteSession } from "./services/postgresqlDB.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';

export async function handleAPI(body: any, request: IncomingMessage, response: ServerResponse): Promise<void> {

  // parse out the request info
  const { headers, method, url } = request;
  console.log('auth: ', url, method);

  if (url === '/auth/login') {

    // check that email exists in DB
    console.log('auth login: ', body);
    const searchResults = await findUsers(body.email);

    // check pass
    bcrypt.compare(body.password, searchResults.password as any).then(function(result) {

      // correct pass
      if (result) {

        const logoutSession = async (id: number) => {
          const exists = await checkSession('',id);
          if (exists) await deleteSession(id);
        }

        //delete previous session if exists
        logoutSession(searchResults.id);

        //create accessToken for login
        const accessToken = jwt.sign(
          { 'id': searchResults.id }, 
          process.env.JWT_PASSWORD_ACCESS as jwt.Secret,
          { expiresIn: '30m' }
        );
        //create refreshToken for a session
        const refreshToken = jwt.sign(
          { 'id': searchResults.id }, 
          process.env.JWT_PASSWORD_REFRESH as jwt.Secret,
          { expiresIn: '1d' }
        );

        // store session
        const session = createSession(refreshToken, searchResults.id);

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

        return;

      }

      //bad credentials
      response.writeHead(403, { 
        'Content-Type': 'text/plain', 
        'ok': 'false',
        'message': 'bad login credentials'
      })
      .end('bad login credentials\n');
      return;

    });
  }

  // REGISTER USER
  if (url === '/auth/register' && method === 'POST') {

    console.log('auth reg ', body);
    // data validation
    if (!body.email || !body.password || !body.name) {

      response.writeHead(201, { 
        'Content-Type': 'text/plain',
        'ok': 'false'
      });
      response.end('\nmust provide user name, password, and name');
      return;
    }

    const saltRounds = 10;
    bcrypt.hash(body.password, saltRounds).then(function(hash) {
      let hashedPassword = hash;

      const userLogInData = {
        userName: body.email,
        password: hashedPassword,
        name: body.name
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
}




