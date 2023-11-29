import { QueryResultRow } from "pg";
import { pool } from "../services/postgresqlDB.js";
import { getGroups } from "./groups.js";
import { registerUsers } from "./registerUsers.js";
import { authUsers } from "./authUsers.js";
import { IncomingMessage, ServerResponse } from "http";
import bcrypt from 'bcrypt';

export const userRoute = (body: any, req: IncomingMessage, res: ServerResponse) => {
    console.log('userRoute', req.url, req.method);
  if (req.method === 'POST' && req.url === '/users/register') {
    registerUsers(body, req, res);
    return;
  } else if (req.method === 'POST' && req.url === '/users/auth') {
    authUsers(body, req, res);
    return;
  } else {
    let urlParameterString = req.url?.slice(req.url?.lastIndexOf('/')+1);
    if (urlParameterString) {
      let urlParameter = parseInt(urlParameterString);

      if (req.method === 'GET') {
        getUser(urlParameter, req, res);
      }
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
