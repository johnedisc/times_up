import { IncomingMessage, ServerResponse } from "http";
import jwt from "jsonwebtoken";
import { refreshJWT } from "./refreshJWT";

export const verifyJWT = async (request: IncomingMessage, response: ServerResponse): Promise<boolean | number> => {

  const accessToken = request.headers['authorization']?.split(' ')[1];
  console.log('accessToken === ', accessToken);

  let verified = false;

  if (accessToken === 'null' || !accessToken || accessToken === '') {
    console.log('no token');

    response
      .writeHead(401, {
      'Content-Type': 'text/plain', 
      'ok': 'false',
      'message': 'return to login'
    })
      .end(); 

  } else if (accessToken) {

    console.log('token exists', accessToken);
    jwt.verify(
      accessToken, 
      process.env.JWT_PASSWORD_ACCESS as jwt.Secret, 
      function(error, decoded) {
        console.log('decoded',decoded);
        if (error) {
          console.log('token not verified ', error);
          response
          .writeHead(403, {
            'Content-Type': 'text/plain', 
            'ok': 'false',
            'message': 'bad accessToken'
          })
          .end(); 

        } else {
          console.log('token is good', decoded);
          verified = true;
        }
      })
  }

  return verified;
}
