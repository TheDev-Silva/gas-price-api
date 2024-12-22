import { FastifyInstance } from 'fastify';
import { addFuelType, getFuelType } from '../controllers/fuelTypes';

const fuelTypesRoutes = async (fastify: FastifyInstance) => {
  fastify.post('/fuel-type', addFuelType); // Add a new fuel price
  fastify.get('/fuel-types', getFuelType); // Get all fuel prices
};

export default fuelTypesRoutes;
