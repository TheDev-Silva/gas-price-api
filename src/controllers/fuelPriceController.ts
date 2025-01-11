import { FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../models/prismaClient';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const Token = process.env.JWT_TOKEN_WEB;

interface FuelPriceBody {
   gasStationName: string;
   address: string;
   fuelType: string;
   price: number;
}

export const addFuelPrice = async (
   request: FastifyRequest<{ Body: FuelPriceBody }>,
   reply: FastifyReply
) => {
   const fuelPriceSchema = z.object({
      gasStationName: z.string(),
      address: z.string(),
      fuelType: z.string(),
      price: z.number(),
   });

   try {
      // Validando os dados recebidos
      const { gasStationName, address, fuelType, price } = fuelPriceSchema.parse(request.body);

      // Verificando o token JWT para obter o ID do usuário
      const token = request.headers.authorization?.split(' ')[1]; // Assume que o token está no cabeçalho 'Authorization'
      if (!token) {
         return reply.status(401).send({ error: 'Token de autenticação não encontrado.' });
      }

      // Verificando e decodificando o token JWT
      if (!Token) {
         return reply.status(500).send({ error: 'Token de autenticação não configurado.' });
      }

      const decoded = jwt.verify(token, Token) as { id: number } | null;

      if (!decoded || !decoded.id) {
         return reply.status(401).send({ error: 'Token inválido ou usuário não autenticado.' });
      }

      const userId = decoded.id; // ID do usuário extraído do token


      // Verificando se o usuário existe
      const userExists = await prisma.user.findUnique({
         where: { id: userId },
      });
      console.log('EXISTENTE: ', userExists);
      if (!userExists) {
         return reply.status(404).send({ error: 'Usuário não encontrado.' });
      }

      // Criação do posto de gasolina, se necessário
      const gasStationRecord = await prisma.gasStation.upsert({
         where: { name_address: { name: gasStationName, address: address } },
         update: {}, // Não atualiza se já existir
         create: {
            name: gasStationName,
            address: address,
         },
      });

      // Criando o preço do combustível com o userId extraído do token
      const fuelPrice = await prisma.fuelPrice.create({
         data: {
            fuelType: fuelType,
            price: price,
            address: address,
            gasStationId: gasStationRecord.id, // Relacionando com o posto de gasolina
            userId: userId, // Usando o ID do usuário extraído do token
         },
      });

      // Enviando a resposta ao cliente
      reply.status(201).send(fuelPrice);
   } catch (error) {
      console.error(error);
      reply.status(400).send({ error: 'Dados inválidos ou erro ao processar o preço do combustível.' });
   }
};




export const getFuelPrices = async (request: FastifyRequest, reply: FastifyReply) => {
   try {
      const { fuelType } = request.query as { fuelType?: string };

      const fuelPrices = await prisma.fuelPrice.findMany({
         where: {
            fuelType: {
               startsWith: fuelType,
               mode: 'insensitive',
            },
         },
         include: {
            GasStation: true,
            User: true
            //user: true, // Inclui as informações do usuário
            //gasStation: true, // Inclui as informações do posto de gasolina
         },
      });

      reply.send(fuelPrices);
   } catch (error) {
      reply.code(500).send({ error: 'Failed to fetch fuel prices' });
   }
};



