import { IncomingMessage, ServerResponse } from "http";
import bcrypt from 'bcrypt';
import { createGroup } from './groups.js';
import { QueryResultRow } from "pg";
import { pool, getIdByEmail } from "../services/postgresqlDB.js";

export const registerUsers = async (body: any, req: IncomingMessage, res: ServerResponse): Promise<void> => {
  console.log('body', body);

  // data validation
  if (!body.email || !body.password || !body.name) {

    res.writeHead(400, { 
      'ok': 'false',
      'message': 'missing credentials'
    });
    res.end();
    return;
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(body.password, saltRounds);

  const userLogInData = {
    email: body.email,
    password: hashedPassword,
    name: body.name
  }

  // check if user already exists
  const searchResults = await getIdByEmail(userLogInData.email);
  if (searchResults !== undefined) {
    res.writeHead(400, { 
      'ok': 'false',
      'message': 'user already exists'
    })
    .end();
    return;
  };

  // add user to DB
  const result:QueryResultRow = await pool.query(
    'INSERT INTO user_info(email,name,password) VALUES ($1,$2,$3) RETURNING *',
    [userLogInData.email, userLogInData.name, userLogInData.password]
  );
  if (result.rows.length === 0) {
    res.writeHead(500, { 
      'Content-Type': 'application/json', 
      'ok': 'false',
    })
    .end(JSON.stringify({ 'message': 'db entry error' }));
    return;
  } else {
    res.writeHead(201, { 
      'ok': 'true',
      'message': 'successful insertion'
    });
    res.end();
    return;
  }
}

