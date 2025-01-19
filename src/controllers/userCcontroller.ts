import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateUserInput, LoginUserInput, AuthenticatedUser, User } from '../types/user';
import prisma from '../models/prismaClient';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const Token = process.env.JWT_TOKEN_WEB
console.log(Token)

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
      console.log('Token assinado com chave:', Token); // Adicione esse log
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
            fuelPrices: true, // Use o nome correto do relacionamento conforme definido no schema do Prisma
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


export const deleteUser = async (
   request: FastifyRequest,
   reply: FastifyReply
) => {
   try {
      const token = request.headers.authorization?.split(' ')[1];
      if (!token) {
         return reply.status(401).send({ error: 'Token de autenticação não encontrado.' });
      }

      if (!Token) {
         return reply.status(500).send({ error: 'Token de autenticação não configurado.' });
      }

      const decoded = jwt.verify(token, Token) as { id: number } | null;
      if (!decoded || !decoded.id) {
         return reply.status(401).send({ error: 'Token inválido ou usuário não autenticado.' });
      }

      const userId = decoded.id;

      // Verifica se o usuário existe
      const user = await prisma.user.findUnique({
         where: { id: userId },
      });

      if (!user) {
         return reply.status(404).send({ error: 'Usuário não encontrado.' });
      }

      // Exclusão de preços de combustível relacionados
      await prisma.fuelPrice.deleteMany({
         where: { userId },
      });

      // Exclusão de outros dados relacionados (adicionar mais exclusões conforme necessário)
      // Exemplo para `GasStation`, se relacionado diretamente ao usuário:
      //await prisma.gasStation.deleteMany({ where: { id: userId } });

      // Exclusão do próprio usuário
      await prisma.user.delete({
         where: { id: userId },
      });

      return reply.status(200).send({ message: 'Usuário e dados relacionados excluídos com sucesso.' });
   } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      reply.status(500).send({ error: 'Erro ao deletar o usuário.' });
   }
};

