import type { FastifyRequest } from 'fastify';
import type { SocketStream } from '@fastify/websocket';
import { z } from 'zod';

import { voting } from '@/utils/voting-pub-sub';

export async function getPollResults(connection: SocketStream, request: FastifyRequest) {
  const pollResultsParams = z.object({
    pollId: z.string().uuid(),
  });

  const { pollId } = pollResultsParams.parse(request.params);

  voting.subscribe(pollId, message => {
    connection.socket.send(JSON.stringify(message));
  });
}
