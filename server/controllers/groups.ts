import { QueryResultRow } from "pg";
import { pool } from "../services/postgresqlDB.js";
import { IncomingMessage, ServerResponse } from "http";

export const getGroups = async (id: number): Promise<undefined | string | any> => {
  const result:QueryResultRow = await pool.query(
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

    `,
    [id]
  );

  if (result.rows.length === 0) return undefined;

  return result.rows;
}

export const createGroup = async (body: any, req: IncomingMessage, res: ServerResponse): Promise<void> => {
  const result:QueryResultRow = await pool.query(
    `
    INSERT INTO groups(group_name, owner_id) 
    VALUES ($1,$2) 
    RETURNING groups.id
    `,
    [body.name, body.ownerId]
  );
  if (result.rows.length === 0) {
    res.writeHead(500, { 
      'ok': 'false',
      'message': 'db error'
    })
    .end();
    return;
  }
  res.writeHead(201, { 
    'ok': 'true',
    'message': 'sucessful update',
    'Content-Type': 'application/json'
  })
  .end(JSON.stringify(result.rows[0]));

}

export const createGroupMember = async (groupId: number, userId: number): Promise<undefined | string | any> => {
  const result:QueryResultRow = await pool.query(
    `
    INSERT INTO group_members(group_id, user_id) 
    VALUES ($1,$2) 
    `,
    [groupId, userId]
  );
  if (result.rows.length === 0) return undefined;

  return result.rows[0];
}
