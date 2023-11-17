import { IncomingMessage, ServerResponse } from "http";
import jwt from "jsonwebtoken";
import { refreshJWT } from "./refreshJWT";

export const verifyJWT = async (request: IncomingMessage, response: ServerResponse) => {
  const accessToken = request.headers['authorization']?.split(' ')[1];
  console.log('token: ', accessToken, new Date());
  if (accessToken === undefined || accessToken === '') {
  console.log('if statement: ', accessToken);
    response
    .writeHead(401, {
      'Content-Type': 'text/plain', 
      'ok': 'false',
      'message': 'return to login'
    })
    .end(); 
    return false;
  } else if (accessToken) {
    jwt.verify(
      accessToken, 
      process.env.JWT_PASSWORD_ACCESS as jwt.Secret, 
      function(error, decoded) {
          console.log('verify: ', decoded);
        if (error) {
          console.log('what\'s the error look like?', error);
          response
          .writeHead(403, {
            'Content-Type': 'text/plain', 
            'ok': 'false',
            'message': 'bad accessToken'
          })
          .end(); 

          return false;
        } else {
          refreshJWT(request, response);
        }
      })
  }
}
