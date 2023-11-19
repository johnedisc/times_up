
import { IncomingMessage, ServerResponse } from "http";
import jwt from "jsonwebtoken";
import { checkSession } from "./postgresqlDB.js";

export const refreshJWT = async (request: IncomingMessage, response: ServerResponse): Promise<boolean | number> => {
  const cookie = request.headers['cookie']?.slice(3);
  const sessionData = await checkSession(cookie);

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

        if (error || sessionData.account_id !== (decoded as any).id) {
          console.log('tampered token', error);
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
      })

        console.log('in refresh function');
      return sessionData.account_id;
  }
}
