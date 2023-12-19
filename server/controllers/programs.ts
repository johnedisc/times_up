import { IncomingMessage, ServerResponse } from "http";
import { createProgram, getIntervals, getTable, createInterval, findUsers, getIdByEmail } from "../services/postgresqlDB.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { QueryResultRow } from "pg";


export async function programsRoute(body: any, req: IncomingMessage, res: ServerResponse): Promise<void> {
  console.log('programsRoute', req.url, req.method);
  if (req.method === 'POST' && req.url === '/programs') {

  } else {
    let urlParameterString = req.url?.slice(req.url?.lastIndexOf('/')+1);
    if (urlParameterString) {
      let urlParameter = parseInt(urlParameterString);

      if (req.method === 'GET') getPrograms(urlParameter, body, req, res);
    }
  }

}

export async function getPrograms(programNumber: number, body: any, req: IncomingMessage, res: ServerResponse): Promise<void> {
  
  console.log('getPrograms', programNumber, body);
  // parse out the req info
  const { headers, method, url } = req;
  const { id, accessToken } = body;

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
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'message': 'no programs',
        'ok': 'false',
        'programs': 'false'
      });
      res.end(JSON.stringify(userDataFromDB));

    } else {
    console.log('yes');
      res.writeHead(200, { 
        'Content-Type': 'application/json',
        'ok': 'true',
        'message': 'program found'
      });
      userDataFromDB.programs = programs;
      res.end(JSON.stringify(userDataFromDB));
    }

  } else if (body && url === '/programName') {
    console.log(2);
    const programs = await createProgram(userDataFromDB.id, body.group_id, body.program_name);
    const allPrograms = await getIntervals(userDataFromDB.id);
    console.log(programs);
    console.log(userDataFromDB);

      if (!programs) {
        res.writeHead(401, {
          'message': 'trouble with the create program function',
          'ok': 'false',
          'programs': 'false'
        });
        res.end();
      } else {
        res.writeHead(200, { 
          'Content-Type': 'application/json',
          'ok': 'true',
          'message': 'program found'
        });
        userDataFromDB.programs = allPrograms;
        res.end(JSON.stringify(userDataFromDB));
      }

  } else if (body && url === '/intervalName') {
    console.log(3, body);
    const programs = await createInterval(body.interval_program_id, body.interval_name, body.sequence_number, body.time_seconds);
    const allPrograms = await getIntervals(userDataFromDB.id);

      if (programs === undefined) {
        res.writeHead(401, {
          'message': 'trouble with the create program function',
          'ok': 'false',
          'programs': 'false'
        });
        res.end();
      } else {
        res.writeHead(200, { 
          'Content-Type': 'application/json',
          'ok': 'true',
          'message': 'program found'
        });
        userDataFromDB.programs = allPrograms;
        res.end(JSON.stringify(userDataFromDB));
      }
  } else {
    console.log(4);
    res.writeHead(401, 'token expired');
    res.end();
  }

}
