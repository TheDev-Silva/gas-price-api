import Fastify from 'fastify';
import fuelPriceRoutes from './routes/fuelPriceRoutes';
import cors from '@fastify/cors';


const fastify = Fastify({ logger: true });

fastify.register(cors, {
  origin: true
})

fastify.register(fuelPriceRoutes, { prefix: '/prices' });

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});
