import fastify from 'fastify';
import fuelPriceRoutes from './routes/fuelPriceRoutes';
import gasStationRoutes from './routes/gasStationRoutes';
import userRoutes from './routes/userRoutes';

const app = fastify();

// Registra as rotas
app.get('/', (req, reply) => {
  reply.send({ message: 'API funcionando!' });
});
app.register(fuelPriceRoutes);
app.register(gasStationRoutes);
app.register(userRoutes);

// Exporta como uma função que Vercel pode entender
export default async (req: any, res: any) => {
  try {
    // Certifica-se de que o Fastify está pronto para processar as requisições
    await app.ready();
    // Encaminha a requisição para o servidor Fastify
    app.server.emit('request', req, res);
  } catch (err) {
    // Em caso de erro, envia uma resposta diretamente
    res.statusCode = 500;
    res.end('Internal Server Error');
    console.error(err);
  }
};
/* if (require.main === module) {
  app.listen({ port: 3000, host: '0.0.0.0' }, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server running at http://192.168.0.13:3000`);
  });
} */
/* app.listen({ port: 3000, host: '0.0.0.0' }, (err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server running at http://192.168.0.13:3000`);
}); */