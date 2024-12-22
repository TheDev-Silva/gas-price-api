import 'fastify';
import prisma from '../models/prismaClient';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: number;
      email: string;
    };
  }
}

const allFuelPrices = await prisma.fuelPrice.findMany({
  include: {
    user: true,
    gasStation: true
  }
})

