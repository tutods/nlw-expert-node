import fastifyCookie from '@fastify/cookie';
import fastify from 'fastify';

import { routes } from './routes';

const app = fastify();
app
  // Cookies plugin
  .register(fastifyCookie, {
    secret: process.env.COOKIES_SECRET ?? '',
    hook: 'onRequest',
  })
  // Routes
  .register(routes)
  // Port
  .listen({ port: 3333 })
  .then(() => {
    console.info('🚀 HTTP server running on port ":3333"!');
  });
