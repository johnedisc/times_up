
import { IncomingMessage, ServerResponse } from "http";
import jwt from "jsonwebtoken";
import { checkSession, findUsers } from "./postgresqlDB.js";

export const refreshJWT = async (request: IncomingMessage, response: ServerResponse) => {
  const cookie = request.headers['cookie']?.slice(3);
  const sessionData = await checkSession(cookie);

  console.log('session: ', sessionData);
  console.log('cookie: ', cookie);
  if (!cookie) {
    response
    .writeHead(403, {
      'Content-Type': 'text/plain', 
      'ok': 'false',
      'message': 'return to login'
    })
    .end(); 
    return false;
  } else {
    jwt.verify(
      cookie, 
      process.env.JWT_PASSWORD_REFRESH as jwt.Secret, 
      function(error, decoded) {
        console.log(decoded);
        if (error) {
          console.log('what\'s the error look like?', error);
          response
          .writeHead(403, {
            'Content-Type': 'text/plain', 
            'ok': 'false',
            'message': 'bad token'
          })
          .end(); 

          return false;
        }
        
        //create accessToken
        const accessToken = jwt.sign(
          { 'email': 'ralph' }, 
          process.env.JWT_PASSWORD_ACCESS as jwt.Secret,
          { expiresIn: '30m' }
        );

        response.end(JSON.stringify(accessToken));
        return ;
      })
  }
}
