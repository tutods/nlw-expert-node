import fastifyCookie from '@fastify/cookie';
import fastifyWebsocket from '@fastify/websocket';
import fastify from 'fastify';

import { routes } from './routes';
import { pollsWsRoutes } from './routes/ws';

const app = fastify();

app
  // Cookies plugin
  .register(fastifyCookie, {
    secret: process.env.COOKIES_SECRET ?? '',
    hook: 'onRequest',
  })
  // Websocket plugin
  .register(fastifyWebsocket)
  // Routes
  .register(routes)
  .register(pollsWsRoutes, { prefix: '/polls' })
  // Port
  .listen({ port: 3333 })
  .then(() => {
    console.info('🚀 HTTP server running on port ":3333"!');
  });
