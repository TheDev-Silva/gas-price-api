import { FastifyInstance } from 'fastify';
import { addGasStation, getGasStations } from '../controllers/gasStationController';
import { authMiddleware } from '../utils/auth';

const gasStationRoutes = async (fastify: FastifyInstance) => {
  fastify.post('/gas-station', addGasStation); // Add a new gas station
  fastify.get('/gas-stations', { preHandler: authMiddleware }, getGasStations); // Get all gas stations
};

export default gasStationRoutes;
