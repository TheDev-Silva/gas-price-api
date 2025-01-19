import { FastifyInstance } from 'fastify';
import { addFuelPrice, getFuelPrices } from '../controllers/fuelPriceController';
import { authMiddleware } from '../utils/auth';


const fuelPriceRoutes = async (fastify: FastifyInstance) => {
  fastify.post('/fuel-price', addFuelPrice); // Add a new fuel price
  fastify.get('/fuel-prices', /* { preHandler: authMiddleware }, */ getFuelPrices); // Get all fuel prices
};

export default fuelPriceRoutes;
