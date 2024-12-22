import { FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../models/prismaClient';
import jwt from 'jsonwebtoken';

const Token = process.env.JWT_TOKEN_WEB;

interface FuelPriceBody {
   gasStationName: string;
   address: string;
   fuelType: string; // Nome do tipo de combustível
   price: number;
}

export const addFuelPrice = async (
   request: FastifyRequest<{ Body: FuelPriceBody }>,
   reply: FastifyReply
) => {
   try {
      // Recupera o token JWT
      const authHeader = request.headers.authorization;
      if (!authHeader) {
         return reply.code(401).send({ error: 'Unauthorized' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, Token!) as { id: number };

      if (!decoded.id) {
         return reply.code(401).send({ error: 'Token inválido ou expirado.' });
      }

      const { gasStationName, address, fuelType, price } = request.body;

      if (!gasStationName || !address || !fuelType || !price) {
         return reply.code(400).send({ error: 'Dados do posto incompletos.' });
      }

      // Cria ou recupera o tipo de combustível
      const fuelTypeRecord = await prisma.fuelType.upsert({
         where: { name: fuelType },
         update: {},
         create: {
            name: fuelType,
            createdBy: decoded.id, // Associando o tipo ao usuário
         },
      });

      // Cria ou recupera o posto de gasolina
      const gasStation = await prisma.gasStation.upsert({
         where: { name_address: { name: gasStationName, address } }, // Garantindo unicidade
         update: {},
         create: {
            name: gasStationName,
            address,
         },
      });

      // Cadastra o preço do combustível associado ao usuário logado
      const fuelPrice = await prisma.fuelPrice.create({
         data: {
            gasStationId: gasStation.id,
            fuelTypeId: fuelTypeRecord.id, // Associando ao tipo de combustível
            price,
            userId: decoded.id, // Usuário que registrou
         },
      });

      reply.code(201).send(fuelPrice);
   } catch (error) {
      console.error(error);
      reply.code(500).send({ error: 'Failed to add fuel price' });
   }
};

export const getFuelPrices = async (
   request: FastifyRequest,
   reply: FastifyReply
) => {
   try {
      const { fuelType } = request.query as { fuelType?: string };

      const fuelPrices = await prisma.fuelPrice.findMany({
         where: {
            fuelType: {
               name: {
                  startsWith: fuelType,
                  mode: 'insensitive',
               },
            },
         },
         include: {
            user: true,
            gasStation: true,
            fuelType: true, // Incluindo informações do tipo de combustível
         },
      });

      reply.send(fuelPrices);
   } catch (error) {
      console.error(error);
      reply.code(500).send({ error: 'Failed to fetch fuel prices' });
   }
};


