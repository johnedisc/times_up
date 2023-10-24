import { IncomingMessage, ServerResponse } from "http";
import { createProgram, getIntervals, getTable, createInterval } from "./postgresqlDB.js";
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
  console.log('programs: ', url, method);

  request
  .on('error', err => {
    console.error('request error', err);
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
    console.log('this is line 40, programs ', decoded);

    if (decoded && url === '/programs') {
      const programs = getIntervals(bodyJSON.id);
      programs
        .then((programNamesFromSQL) => {

              if (programNamesFromSQL === undefined) {
                response.writeHead(401, {
                  'message': 'program not found',
                  'ok': 'false',
                  'programs': 'false'
                });
                response.end();
                return 1;
              } else {
                response.writeHead(200, { 
                  'Content-Type': 'application/json',
                  'ok': 'true',
                  'message': 'program found'
                });
                response.end(JSON.stringify(programNamesFromSQL));
              }
        });
    } else if (decoded && url === '/programName') {
      const programs = createProgram(bodyJSON.user_id, bodyJSON.group_id, bodyJSON.program_name);
      programs
        .then((programNamesFromSQL) => {

          console.log(programNamesFromSQL);
              if (programNamesFromSQL === undefined) {
                response.writeHead(401, {
                  'message': 'trouble with the create program function',
                  'ok': 'false',
                  'programs': 'false'
                });
                response.end();
                return 1;
              } else {
                response.writeHead(200, { 
                  'Content-Type': 'application/json',
                  'ok': 'true',
                  'message': 'program found'
                });
                response.end(JSON.stringify(programNamesFromSQL));
              }
        });
    } else if (decoded && url === '/intervalName') {
      const programs = createInterval(bodyJSON.interval_program_id, bodyJSON.interval_name, bodyJSON.sequence_number, bodyJSON.time_seconds);
      programs
        .then((programNamesFromSQL) => {

          console.log(programNamesFromSQL);
              if (programNamesFromSQL === undefined) {
                response.writeHead(401, {
                  'message': 'trouble with the create program function',
                  'ok': 'false',
                  'programs': 'false'
                });
                response.end();
                return 1;
              } else {
                response.writeHead(200, { 
                  'Content-Type': 'application/json',
                  'ok': 'true',
                  'message': 'program found'
                });
                response.end(JSON.stringify(programNamesFromSQL));
              }
        });
    } else {
      response.writeHead(401, 'token expired');
      response.end();
      return 0;
    }
  });
}
