import { IncomingMessage, ServerResponse } from "http";
import { registerUser, findUsers, createGroup, grabPrograms } from "./postgresqlDB.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { QueryResultRow } from "pg";


export function programs(request: IncomingMessage, response: ServerResponse): void {

  // initialize the request body stream variables
  let body:any = [];
  let bodyString:string;
  let bodyJSON:any;

  // parse out the request info
  const { headers, method, url } = request;
  console.log(url, method);

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

    let decoded = jwt.verify(bodyJSON.token, process.env.JWT_PASSWORD as jwt.Secret);

    if (decoded) {
      const programs = grabPrograms(bodyJSON.id);
      programs
        .then((returnedResult) => {
          if (returnedResult === undefined) {
            response.writeHead(401, 'no programs found');
            response.end();
            return 1;
          }
          response.writeHead(200, { 
            'Content-Type': 'application/json',
            'ok': 'true',
            'message': 'program found'
          });
          response.end(JSON.stringify(returnedResult));
        });
    } else {
      response.writeHead(401, 'token expired');
      response.end();
      return 0;
    }
  });
}