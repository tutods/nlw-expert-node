import type { FastifyInstance } from 'fastify';

import { getPollResults } from './get-poll-results';

export async function pollsWsRoutes(fastify: FastifyInstance) {
  fastify.get('/:pollId/results', { websocket: true }, getPollResults);
}
