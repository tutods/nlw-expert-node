import type { FastifyReply, FastifyRequest } from 'fastify';
import { randomUUID } from 'crypto';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

export async function voteOnPoll(request: FastifyRequest, reply: FastifyReply) {
  const voteOnPollParams = z.object({
    pollId: z.string().uuid(),
  });
  const voteOnPollBody = z.object({
    optionId: z.string().uuid(),
  });

  const { pollId } = voteOnPollParams.parse(request.params);
  const { optionId } = voteOnPollBody.parse(request.body);

  let { sessionId } = request.cookies;
  console.log(sessionId);

  if (sessionId) {
    const userPreviousVoteOnPoll = await prisma.vote.findUnique({
      where: {
        sessionId_pollId: {
          sessionId,
          pollId,
        },
      },
    });

    if (userPreviousVoteOnPoll) {
      if (userPreviousVoteOnPoll.optionId !== optionId) {
        // Delete previous vote
        await prisma.vote.delete({
          where: {
            id: userPreviousVoteOnPoll.id,
          },
        });
      } else {
        return reply.status(400).send({
          message: 'You already vote on this poll.',
        });
      }
    }
  }

  if (!sessionId) {
    sessionId = randomUUID();
    console.log(sessionId, '<-');
    reply.setCookie('sessionId', sessionId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      signed: true,
      httpOnly: true,
    });
  }

  await prisma.vote.create({
    data: {
      sessionId,
      pollId,
      optionId,
    },
  });

  return reply.status(201).send();
}
