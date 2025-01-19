import { FastifyInstance } from 'fastify';
import { registerUser, loginUser, getRegisterUser, deleteUser, renewToken } from '../controllers/userCcontroller';
import { authMiddleware } from '../utils/auth';

const userRoutes = async (fastify: FastifyInstance) => {
  fastify.post('/register', registerUser);
  fastify.get('/register-userId', { preHandler: authMiddleware }, getRegisterUser);
  fastify.post('/login', loginUser);
  fastify.delete('/delete-userId', deleteUser);
  fastify.post('/renewToken', renewToken)

};

export default userRoutes;
