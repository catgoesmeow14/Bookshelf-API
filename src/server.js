import Hapi from '@hapi/hapi';
import { routes as bookRoutes } from './routes/books.js';

const config = {
  port: 9000,
  host: 'localhost',
};

const init = async (c) => {
  const server = Hapi.server({
    port: c.port,
    host: c.host,
    routes: {
      cors: {
        origin: ['*'], // This will enable CORS for all routes
      },
    },
  });

  server.route(bookRoutes);

  await server.start();
  console.log(`Server running at ${server.info.uri}`);

  return server;
};

init(config);
