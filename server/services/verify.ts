import { IncomingMessage, ServerResponse } from 'http';
import { verifyJWT } from './verifyJWT.js'
import { refreshJWT } from './refreshJWT.js'

export async function verification(request: IncomingMessage, response: ServerResponse) {
  const verified = await verifyJWT(request, response);
  console.log('verified',verified);
  if (verified) {
    const refreshId = await refreshJWT(request, response);
    console.log('refrefreshId', refreshId);
    return refreshId;
  }
}
