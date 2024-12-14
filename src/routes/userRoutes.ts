import { FastifyInstance } from 'fastify';
import { registerUser, loginUser } from '../controllers/userCcontroller';

const userRoutes = async (fastify: FastifyInstance) => {
  fastify.post('/register', registerUser);
  fastify.post('/login', loginUser);
};

export default userRoutes;
