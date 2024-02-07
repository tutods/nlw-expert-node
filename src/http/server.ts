import fastify from 'fastify';
import { z } from 'zod';

import { PrismaClient } from '@prisma/client';

const app = fastify();
const prisma = new PrismaClient();

app.get('/', () => {
  return {
    ok: true,
  };
});

app.post('/polls', async (request, reply) => {
  const createPollBody = z.object({
    title: z.string(),
  });

  const { title } = createPollBody.parse(request.body);

  const poll = await prisma.poll.create({
    data: {
      title,
    },
  });

  return reply.status(201).send(poll);
});

app.listen({ port: 3333 }).then(() => {
  console.info('🚀 HTTP server running on port ":3333"!');
});
