import type { FastifyInstance } from 'fastify';

import { createPoll } from './create-poll';
import { getPoll } from './get-poll';
import { voteOnPoll } from './vote-on-poll';

export async function pollsRoutes(fastify: FastifyInstance) {
  // Route to get a poll by id
  fastify.get('/:pollId', getPoll);

  // Route to create a new poll
  fastify.post('/', createPoll);

  // Route to add a vote to a specific poll
  fastify.post('/:pollId/vote', voteOnPoll);
}
