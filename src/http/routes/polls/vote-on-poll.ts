import type { FastifyReply, FastifyRequest } from 'fastify';
import { randomUUID } from 'crypto';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { voting } from '@/utils/voting-pub-sub';

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

        // Decrement the ranking of the previous `optionId` on `pollId`
        await redis.zincrby(pollId, -1, userPreviousVoteOnPoll.optionId);
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

  // Increment the ranking of `optionId` on `pollId`
  const votes = await redis.zincrby(pollId, 1, optionId);

  voting.publish(pollId, {
    optionId,
    votes: Number(votes),
  });

  return reply.status(201).send();
}
