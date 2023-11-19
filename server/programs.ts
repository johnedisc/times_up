import { IncomingMessage, ServerResponse } from "http";
import { createProgram, getIntervals, getTable, createInterval, findEmailById, findUsers } from "./postgresqlDB.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { QueryResultRow } from "pg";
import { IncomingMessageWithUser } from "./server.js";


export async function programs(userId: number, body: any, request: IncomingMessage, response: ServerResponse): Promise<void> {
  
  // parse out the request info
  const { headers, method, url } = request;

  const email = await findEmailById(userId);
  const user = await findUsers(email.email);

  const userDataFromDB = { 
    name: user.name, 
    email: user.email,
    id: user.id,
    groups: user.groups,
    programs: []
  };



  console.log('userDataFromDB: ',userDataFromDB);

  if (url === '/programs') {
    console.log(1);

    const programs = await getIntervals(userDataFromDB.id);

    if (programs === undefined) {
    console.log(undefined);
      response.writeHead(401, {
        'message': 'program not found',
        'ok': 'false',
        'programs': 'false'
      });
      response.end(JSON.stringify(userDataFromDB));
      return;
    } else {
    console.log('yes');
      response.writeHead(200, { 
        'Content-Type': 'application/json',
        'ok': 'true',
        'message': 'program found'
      });
      userDataFromDB.programs = programs;
      response.end(JSON.stringify(userDataFromDB));
      return;
    }

  } else if (body && url === '/programName') {
    console.log(2);
    const programs = createProgram(user.user_id, body.group_id, body.program_name);
    programs
    .then((programNamesFromSQL) => {

      if (programNamesFromSQL === undefined) {
        response.writeHead(401, {
          'message': 'trouble with the create program function',
          'ok': 'false',
          'programs': 'false'
        });
        response.end();
        return;
      } else {
        response.writeHead(200, { 
          'Content-Type': 'application/json',
          'ok': 'true',
          'message': 'program found'
        });
        response.end(JSON.stringify(programNamesFromSQL));
      }
    });
  } else if (body && url === '/intervalName') {
    console.log(3);
    const programs = createInterval(body.interval_program_id, body.interval_name, body.sequence_number, body.time_seconds);
    programs
    .then((programNamesFromSQL) => {

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
    console.log(4);
    response.writeHead(401, 'token expired');
    response.end();
  }

}
