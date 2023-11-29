import { QueryResultRow } from "pg";
import { pool } from "../services/postgresqlDB.js";

export const logoutSession = async (id: number) => {
  const exists = await checkSession('',id);
  if (exists) await deleteSession(id);
}

export const createSession = async (sessionId: string, accountId: number): Promise<undefined | string | any> => {
  const result:QueryResultRow = await pool.query(
    'INSERT INTO sessions(session_id, account_id) VALUES ($1,$2) RETURNING *',
    [sessionId, accountId]
  );

  if (result.rows.length === 0) return undefined;

  return result.rows[0];
}

export const checkSession = async (sessionId: string = '', accountId: number = 0): Promise<boolean | any> => {
  let index: string | number;
  let field: string;

  if (sessionId.length > 0) {
    index = sessionId;
    field = 'session_id';
  } else {
    index = accountId;
    field = 'account_id';
  }

  const result:QueryResultRow = await pool.query(
    `SELECT * FROM sessions WHERE ${field}=$1`,
      [index]
  );

  if (result.rows.length === 0) return undefined;

  return result.rows[0];
}

export const deleteSession = async (accountId: number): Promise<boolean | any> => {

  const result:QueryResultRow = await pool.query(
    `DELETE FROM sessions WHERE account_id=$1`,
      [accountId]
  );

  if (result.rows.length === 0) return undefined;

  return result.rows[0];
}
