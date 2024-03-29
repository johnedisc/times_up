import { IncomingMessage, ServerResponse } from "http";
import { createProgram, getIntervals, getTable, createInterval, getIdByEmail, findUsers } from "./services/postgresqlDB.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { QueryResultRow } from "pg";


export async function programs(sessionData: any, body: any, request: IncomingMessage, response: ServerResponse): Promise<void> {
  
  // parse out the request info
  const { headers, method, url } = request;
  const { id, accessToken } = sessionData;

  const email = await getIdByEmail(id);
  const user = await findUsers(email.email);

  const userDataFromDB = { 
    accessToken: accessToken,
    name: user.name, 
    email: user.email,
    id: user.id,
    groups: user.groups,
    programs: []
  };



  console.log('body', body);
  console.log('userDataFromDB: ',userDataFromDB);

  if (url === '/programs') {
    console.log(1);

    const programs = await getIntervals(userDataFromDB.id);
    console.log('programs: ', programs);

    if (!programs) {
      response.writeHead(200, {
        'Content-Type': 'application/json',
        'message': 'no programs',
        'ok': 'false',
        'programs': 'false'
      });
      response.end(JSON.stringify(userDataFromDB));

    } else {
    console.log('yes');
      response.writeHead(200, { 
        'Content-Type': 'application/json',
        'ok': 'true',
        'message': 'program found'
      });
      userDataFromDB.programs = programs;
      response.end(JSON.stringify(userDataFromDB));
    }

  } else if (body && url === '/programName') {
    console.log(2);
    const programs = await createProgram(userDataFromDB.id, body.group_id, body.program_name);
    const allPrograms = await getIntervals(userDataFromDB.id);
    console.log(programs);
    console.log(userDataFromDB);

      if (!programs) {
        response.writeHead(401, {
          'message': 'trouble with the create program function',
          'ok': 'false',
          'programs': 'false'
        });
        response.end();
      } else {
        response.writeHead(200, { 
          'Content-Type': 'application/json',
          'ok': 'true',
          'message': 'program found'
        });
        userDataFromDB.programs = allPrograms;
        response.end(JSON.stringify(userDataFromDB));
      }

  } else if (body && url === '/intervalName') {
    console.log(3, body);
    const programs = await createInterval(body.interval_program_id, body.interval_name, body.sequence_number, body.time_seconds);
    const allPrograms = await getIntervals(userDataFromDB.id);

      if (programs === undefined) {
        response.writeHead(401, {
          'message': 'trouble with the create program function',
          'ok': 'false',
          'programs': 'false'
        });
        response.end();
      } else {
        response.writeHead(200, { 
          'Content-Type': 'application/json',
          'ok': 'true',
          'message': 'program found'
        });
        userDataFromDB.programs = allPrograms;
        response.end(JSON.stringify(userDataFromDB));
      }
  } else {
    console.log(4);
    response.writeHead(401, 'token expired');
    response.end();
  }

}
