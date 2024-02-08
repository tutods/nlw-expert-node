import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

export async function getPoll(request: FastifyRequest, reply: FastifyReply) {
  const getPollParams = z.object({
    pollId: z.string().uuid(),
  });

  const { pollId } = getPollParams.parse(request.params);

  const poll = await prisma.poll.findUnique({
    where: {
      id: pollId,
    },
    include: {
      options: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!poll) {
    return reply.status(404).send({
      status: 404,
      message: 'Poll not found',
    });
  }

  return reply.send({ poll });
}
