import { IncomingMessage, ServerResponse } from "http";
import bcrypt from 'bcrypt';
import { createGroup } from './groups.js';
import { QueryResultRow } from "pg";
import { pool, getIdByEmail } from "../services/postgresqlDB.js";
import { logoutSession, createSession } from './sessions.js';
import jwt from "jsonwebtoken";

export const authUsers = async (body: any, req: IncomingMessage, res: ServerResponse): Promise<void> => {

  console.log('auth login: ', body);

  // check that email exists in DB
  const userIdFromDB = await getIdByEmail(body.email);
  // no email? 401
  if (!userIdFromDB) {
    res.writeHead(401, { 
      'ok': 'false',
      'message': 'bad login credentials'
    })
    .end();
    return;
  } 

  // grab user data to check credentials
  const result:QueryResultRow = await pool.query(
    'SELECT * FROM user_info WHERE id = $1',
    [userIdFromDB]
  );
  if (result.rows.length === 0) {
    //no results
    res.writeHead(500, { 
      'ok': 'false',
      'message': 'db error'
    })
    .end();
  }

  const userDataFromDB = result.rows[0];

  // check pass
  const checkCredentials = await bcrypt.compare(body.password, userDataFromDB.password as any)
  console.log('check cred', checkCredentials);

  // correct pass
  if (checkCredentials) {

    //delete previous session if exists
    logoutSession(userDataFromDB.id);

    //create accessToken for login
    const accessToken = jwt.sign(
      { 'id': userDataFromDB.id }, 
      process.env.JWT_PASSWORD_ACCESS as jwt.Secret,
      { expiresIn: '30m' }
    );
    //create refreshToken for a session
    const refreshToken = jwt.sign(
      { 'id': userDataFromDB.id }, 
      process.env.JWT_PASSWORD_REFRESH as jwt.Secret,
      { expiresIn: '1d' }
    );

    // store session
    const session = createSession(refreshToken, userDataFromDB.id);

    // send cookie
    res.writeHead(201, { 
      'Content-Type': 'text/plain',
      'ok': 'true',
      'message': 'successful insertion',
      'Set-Cookie': `id=${refreshToken}; Path=/; HttpOnly; Max-Age="${24 * 60 * 60 * 1000}"; Secure`
    });
    ////Secure; HttpOnly; SameSite=None; Path=/; Domain=localhost:3300
    res.end(JSON.stringify(accessToken));

    return;
  }

  //bad credentials
  res.writeHead(401, { 
    'ok': 'false',
    'message': 'bad login credentials'
  })
  .end();
  return;

}

