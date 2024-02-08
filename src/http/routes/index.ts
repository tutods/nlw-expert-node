import type { FastifyInstance } from 'fastify';

import { pollsRoutes } from './polls';

export async function routes(fastify: FastifyInstance) {
  fastify.get('/', (_request, reply) => {
    return reply.status(200).send({
      status: 'ok',
    });
  });

  fastify.register(pollsRoutes, {
    prefix: '/polls',
  });
}
