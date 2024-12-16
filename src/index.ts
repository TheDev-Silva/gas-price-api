import fastify from 'fastify';
import fuelPriceRoutes from './routes/fuelPriceRoutes';
import gasStationRoutes from './routes/gasStationRoutes';
import userRoutes from './routes/userRoutes';

const app = fastify();

app.register(fuelPriceRoutes); // Registra as rotas
app.register(userRoutes); // Registra as rotas
app.register(gasStationRoutes); // Registra as rotas

app.listen({ port: 3000 }, (err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server running at http://localhost:3000`);
});
