import { FastifyInstance } from 'fastify';
import { addFuelPrice, getFuelPrices } from '../controllers/fuelPriceController';

const fuelPriceRoutes = async (fastify: FastifyInstance) => {
  fastify.post('/fuel-price', addFuelPrice); // Add a new fuel price
  fastify.get('/fuel-prices', getFuelPrices); // Get all fuel prices
};

export default fuelPriceRoutes;
