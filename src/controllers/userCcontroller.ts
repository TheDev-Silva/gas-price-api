import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateUserInput, LoginUserInput, AuthenticatedUser, User } from '../types/user';
import prisma from '../models/prismaClient';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const Token = process.env.JWT_TOKEN_WEB

export const registerUser = async (
   request: FastifyRequest<{ Body: CreateUserInput }>,
   reply: FastifyReply
) => {
   try {
      const { name, email, password } = request.body;

      // Verifica se o usuário já existe
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
         return reply.code(400).send({ error: 'User already exists' });
      }

      // Criptografa a senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Cria o usuário
      const user = await prisma.user.create({
         data: { name, email, password: hashedPassword },
      });

      // Gera um token JWT
      const token = jwt.sign({ id: user.id }, `${Token}`, { expiresIn: '1h' });

      return reply.code(201).send({ message: 'User created successfully', token });
   } catch (error) {
      reply.code(500).send({ error: 'Failed to register user' });
   }
};


export const loginUser = async (
   request: FastifyRequest<{ Body: LoginUserInput }>,
   reply: FastifyReply
) => {
   try {
      const { email, password } = request.body;

      // Busca o usuário no banco de dados
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
         return reply.code(401).send({ error: 'Invalid email or password' });
      }

      // Verifica a senha
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
         return reply.code(401).send({ error: 'Invalid email or password' });
      }

      // Gera um token JWT
      const token = jwt.sign({ id: user.id }, `${Token}`, { expiresIn: '1h' });

      const authenticatedUser: AuthenticatedUser = {
         id: user.id,
         name: user.name,
         email: user.email,
         token,
      };

      return reply.send(authenticatedUser);
   } catch (error) {
      reply.code(500).send({ error: 'Failed to log in user' });
   }
};

export const getRegisterUser = async (
   request: FastifyRequest,
   reply: FastifyReply
) => {
   try {
      // Pegue o ID do usuário autenticado do token decodificado
      const userId = request.user?.id;

      if (!userId) {
         return reply.code(401).send({ error: 'Usuário não autenticado' });
      }

      // Busque o usuário pelo ID
      const registerUser = await prisma.user.findUnique({
         where: {
            id: userId,
         },
         include: {
            FuelPrice: true, // Inclui os preços de combustível associados ao usuário
         },
      });

      if (!registerUser) {
         return reply.code(404).send({ message: 'Usuário não encontrado!' });
      }
      reply.code(200).send(registerUser);
   } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      reply.code(500).send({ error: 'Erro ao buscar dados do usuário' });
   }
};
