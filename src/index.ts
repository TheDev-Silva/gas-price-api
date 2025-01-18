import fastify from 'fastify';
import fuelPriceRoutes from './routes/fuelPriceRoutes';

import gasStationRoutes from './routes/gasStationRoutes';
import userRoutes from './routes/userRoutes';
/* require('dotenv').config() */

const app = fastify();

app.register(fuelPriceRoutes); // Registra as rotas
app.register(userRoutes); // Registra as rotas
app.register(gasStationRoutes); // Registra as rotas

app.listen({ port: 3000, host: '0.0.0.0' }, (err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server running at http://192.168.0.13:3000`);
});

export default async (req: any, res: any) => {
  await app.ready()
  app.server.emit('request', req, res)
}