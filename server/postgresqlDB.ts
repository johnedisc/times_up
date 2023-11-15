import { Pool, QueryResult, QueryResultRow } from 'pg';
import 'dotenv/config';

type Config = {
  // all valid client config options are also valid here
  // in addition here are the pool specific configuration parameters:

  // number of milliseconds to wait before timing out when connecting a new client
  // by default this is 0 which means no timeout
  connectionTimeoutMillis?: number

  // number of milliseconds a client must sit idle in the pool and not be checked out
  // before it is disconnected from the backend and discarded
  // default is 10000 (10 seconds) - set to 0 to disable auto-disconnection of idle clients
  idleTimeoutMillis?: number

  // maximum number of clients the pool should contain
  // by default this is set to 10.
  max?: number

  // Default behavior is the pool will keep clients open & connected to the backend
  // until idleTimeoutMillis expire for each client and node will maintain a ref
  // to the socket on the client, keeping the event loop alive until all clients are closed
  // after being idle or the pool is manually shutdown with `pool.end()`.
  //
  // Setting `allowExitOnIdle: true` in the config will allow the node event loop to exit
  // as soon as all clients in the pool are idle, even if their socket is still open
  // to the postgres server.  This can be handy in scripts & tests
  // where you don't want to wait for your clients to go idle before your process exits.
  allowExitOnIdle?: boolean
}

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT as number | undefined,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  max: process.env.PG_MAX as number | undefined,
  idleTimeoutMillis: process.env.PG_IDLETIMEOUTMILLIS as number | undefined,
  connectionTimeoutMillis: process.env.PG_CONNECTIONTIMEOUTMILLIS as number | undefined,
})

//pool.on('error', (err, client) => {
//  console.error('Unexpected error on idle client', err);
//  process.exit(-1);
//})

export const findUsers = async (email: string): Promise<undefined | string | any> => {
  const text = 'SELECT * FROM user_info WHERE email = $1';
  const values = [email];
  const result:QueryResultRow = await pool.query(text, values);
  if (result.rows.length === 0) return undefined;
  else {
//    const groups = await getTable(result.rows[0].id, 'group_members', 'user_id');
    const groups = await getGroups(result.rows[0].id);
    result.rows[0].groups = groups;
    return result.rows[0];
  }
}

export const registerUser = async (email: string, name: string, password: string): Promise<any> => {
  try {
    const text = 'INSERT INTO user_info(email,name,password) VALUES ($1,$2,$3) RETURNING *';
    const values = [email,name,password];
    const returnValue = await pool.query(text, values);
    return returnValue.rows[0];
  } catch (error) {
    console.error(error);
  }
}

export const createGroup = async (id: number, name: string): Promise<undefined | string | any> => {
  const text = 'INSERT INTO groups(group_name, owner_id) VALUES ($1,$2) RETURNING groups.id';
  const values = [name, id];
  const result:QueryResultRow = await pool.query(text, values);
  if (result.rows.length === 0) return undefined;
  else {
    const group_membersText = 'INSERT INTO group_members(group_id, user_id) VALUES ($1,$2)';
    const group_membersValues = [result.rows[0].id, id];
    const group_membersResults:QueryResultRow = await pool.query(group_membersText, group_membersValues);
    return result.rows[0];
  }
}

export const createInterval = async (intervalProgramId: number, intervalName: string, sequenceNumber: number, timeSeconds: number): Promise<undefined | string | any> => {
  const text = 'INSERT INTO intervals(interval_program_id, interval_name, sequence_number, time_seconds) VALUES ($1,$2,$3,$4) RETURNING *';
  const values = [intervalProgramId, intervalName, sequenceNumber, timeSeconds];
  const result:QueryResultRow = await pool.query(text, values);
  if (result.rows.length === 0) return undefined;
  else {
    return result.rows[0];
  }
}

export const createProgram = async (userId: number, groupID: number, programName: string): Promise<undefined | string | any> => {
  const text = 'INSERT INTO interval_programs(user_id, group_id, program_name) VALUES ($1,$2,$3) RETURNING *';
  const values = [userId, groupID, programName];
  const result:QueryResultRow = await pool.query(text, values);
  if (result.rows.length === 0) return undefined;
  return result.rows[0];
}

export const getTable = async (id: number, table: string, foreignKeyName: string): Promise<undefined | string | any> => {
  const text = `SELECT * FROM ${table} WHERE ${foreignKeyName} = $1`;
  const values = [id];
  const result:QueryResultRow = await pool.query(text, values);
  if (result.rows.length === 0) return undefined;
  else return result.rows;
}

export const getGroups = async (id: number): Promise<undefined | string | any> => {
  const text = 
  `
    SELECT 
    groups.id AS group_id,
    groups.group_name AS group_name,
    group_members.user_id AS user_id

    FROM
    groups

    INNER JOIN 
    group_members

    ON 
    group_members.group_id = groups.id

    WHERE
    group_members.user_id = $1;

  `;
  const values = [id];
  const result:QueryResultRow = await pool.query(text, values);

  if (result.rows.length === 0) {
    return 1;
  } else {
//    console.log('getIntervals ',new Date());
//    for (let i = 0; i < result.rows.length; i++) {
//      result.rows[i].intervals = await getTable(result.rows[i].program_id, 'intervals', 'interval_program_id');
//    }
    return result.rows;
  }
}

export const getIntervals = async (id: number): Promise<undefined | string | any> => {
  const text = 
  `
    SELECT 
    groups.id AS group_id,
    groups.group_name AS group_name,
    group_members.user_id AS user_id,
    interval_programs.id AS program_id,
    interval_programs.program_name AS program_name

    FROM
    groups

    INNER JOIN 
    group_members

    ON 
    group_members.group_id = groups.id

    INNER JOIN
    interval_programs

    ON
    interval_programs.group_id = group_members.group_id

    WHERE
    interval_programs.user_id = $1 AND group_members.user_id = $1;

  `;
  const values = [id];
  const result:QueryResultRow = await pool.query(text, values);

  if (result.rows.length === 0) {
    return undefined;
  } else {
    for (let i = 0; i < result.rows.length; i++) {
      result.rows[i].intervals = await getTable(result.rows[i].program_id, 'intervals', 'interval_program_id');
    }
    return result.rows;
  }
}

export const createSession = async (sessionId: string, accountId: number): Promise<undefined | string | any> => {
  const text = 'INSERT INTO sessions(session_id, account_id) VALUES ($1,$2) RETURNING *';
  const values = [sessionId, accountId];
  const result:QueryResultRow = await pool.query(text, values);
  if (result.rows.length === 0) return undefined;
  return result.rows[0];
}

export const checkSession = async (sessionId: string = '', accountId: number = 0): Promise<boolean> => {
  let index: string | number;
  let field: string;
  if (sessionId.length > 0) {
    index = sessionId;
    field = 'session_id';
  } else {
    index = accountId;
    field = 'account_id';
  }
  console.log('postgres session: ', index);
  const text = `SELECT * FROM sessions WHERE ${field}=$1`;
  const values = [index];
  const result:QueryResultRow = await pool.query(text, values);
  console.log('check session: ', result.rows[0]);
  if (result.rows.length === 0) return false;
//  await pool.query('DELETE FROM sessions WHERE account_id=$1', [accountId]);
  return true;
}
