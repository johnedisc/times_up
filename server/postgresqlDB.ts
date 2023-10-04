import { Pool, QueryResult, QueryResultRow } from 'pg';

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
  host: 'localhost',
  port: 5432,
  user: 'johnedisc',
  password: '1(Egbdf78',
  database: 'intervaltimer',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
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
  else return result.rows[0];
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
