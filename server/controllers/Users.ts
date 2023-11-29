import { QueryResultRow } from "pg";
import { pool } from "../postgresqlDB.js";
import { getGroups, createGroup } from "./Groups.js";
import { IncomingMessage, ServerResponse } from "http";
import bcrypt from 'bcrypt';

export const userRoute = (body: any, req: IncomingMessage, res: ServerResponse) => {
    console.log('userRoute', req.url, req.method);
  if (req.method === 'POST' && req.url === '/users/register') {
    registerUser(body, req, res);
    return;
  }

  let urlParameterString = req.url?.slice(req.url?.lastIndexOf('/')+1);
  if (urlParameterString) {
    let urlParameter = parseInt(urlParameterString);
  
    if (req.method === 'GET') {
      getUser(urlParameter, req, res);
    }
  }
}

export const getIdByEmail = async (email: string): Promise<undefined | string | any> => {
  const result:QueryResultRow = await pool.query(
    'SELECT * FROM user_info WHERE email = $1',
    [email]
  );
  if (result.rows.length === 0) return undefined;
  else {
    return result.rows[0].id;
  }
}

export const registerUser = async (body: any, req: IncomingMessage, res: ServerResponse): Promise<any> => {

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
    createGroup(result.rows[0].id, userLogInData.name);
    res.writeHead(201, { 
      'ok': 'true',
      'message': 'successful insertion'
    });
    res.end();
    return;
  }
}

export const getUser = async (id: number, req: IncomingMessage, res: ServerResponse): Promise<undefined | string | any> => {
  const result:QueryResultRow = await pool.query(
    'SELECT * FROM user_info WHERE id = $1',
    [id]
  );
  if (result.rows.length === 0) {
      res.writeHead(403, { 
        'Content-Type': 'text/plain', 
        'ok': 'false',
        'message': 'bad login credentials'
      })
      .end('bad login credentials\n');
  }
  else {
//    const groups = await getTable(result.rows[0].id, 'group_members', 'user_id');
    result.rows[0].groups = await getGroups(result.rows[0].id);
    res.writeHead(201, { 
      'Content-Type': 'application/json',
      'ok': 'true',
    });
    res.end(JSON.stringify(result.rows[0]));
  }
}


export const updateUser = async (id: number, email: string, name: string, password: string): Promise<any> => {
  try {
    const text = `Update user_info
      Set   email = $1
            name = $2
            password = $3
      Where id = $4
      RETURNING email, name, id`;
    const values = [email,name,password,id];
    const returnValue = await pool.query(text, values);
    return returnValue.rows[0];
  } catch (error) {
    console.error(error);
  }
}

export const deleteUser = async (id: number): Promise<any> => {
  try {
    const text = `Delete from user_info
      Where id = $1
      `;
    const values = [id];
    const returnValue = await pool.query(text, values);
    return returnValue.rows[0];
  } catch (error) {
    console.error(error);
  }
}
