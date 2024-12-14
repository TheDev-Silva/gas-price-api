import { FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../models/prismaClient';

interface FuelPriceBody {
  gasStationId: number;
  fuelType: string;
  price: number;
  userId: number;
}

export const addFuelPrice = async (
  request: FastifyRequest<{ Body: FuelPriceBody }>,
  reply: FastifyReply
) => {
  const { gasStationId, fuelType, price, userId } = request.body;

  try {
    const fuelPrice = await prisma.fuelPrice.create({
      data: { gasStationId, fuelType, price, userId },
    });

    reply.code(201).send(fuelPrice);
  } catch (error) {
    reply.code(500).send({ error: 'Failed to add fuel price' });
  }
};

export const getFuelPrices = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const fuelPrices = await prisma.fuelPrice.findMany({
      include: {
        gasStation: true,
        user: true,
      },
    });

    reply.send(fuelPrices);
  } catch (error) {
    reply.code(500).send({ error: 'Failed to fetch fuel prices' });
  }
};
