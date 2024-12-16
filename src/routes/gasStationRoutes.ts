import { FastifyInstance } from 'fastify';
import { addGasStation, getGasStations } from '../controllers/gasStationController';

const gasStationRoutes = async (fastify: FastifyInstance) => {
  fastify.post('/gas-station', addGasStation); // Add a new gas station
  fastify.get('/gas-stations', getGasStations); // Get all gas stations
};

export default gasStationRoutes;
