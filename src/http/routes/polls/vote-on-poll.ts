import type { FastifyReply, FastifyRequest } from 'fastify';
import { randomUUID } from 'crypto';
import { z } from 'zod';

export async function voteOnPoll(request: FastifyRequest, reply: FastifyReply) {
  const voteOnPollParams = z.object({
    pollId: z.string().uuid(),
  });
  const voteOnPollBody = z.object({
    optionId: z.string().uuid(),
  });

  const { pollId } = voteOnPollParams.parse(request.params);
  const { optionId } = voteOnPollBody.parse(request.body);

  const sessionId = randomUUID();
  reply.setCookie('sessionId', sessionId, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    signed: true,
    httpOnly: true,
  });

  return reply.status(204).send();
}
