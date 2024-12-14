import { FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../models/prismaClient';

interface GasStationBody {
  name: string;
  latitude: number;
  longitude: number;
  address: string;
}

export const addGasStation = async (
  request: FastifyRequest<{ Body: GasStationBody }>,
  reply: FastifyReply
) => {
  const { name, latitude, longitude, address } = request.body;

  try {
    const gasStation = await prisma.gasStation.create({
      data: { name, latitude, longitude, address },
    });

    reply.code(201).send(gasStation);
  } catch (error) {
    reply.code(500).send({ error: 'Failed to add gas station' });
  }
};

export const getGasStations = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const gasStations = await prisma.gasStation.findMany();
    reply.send(gasStations);
  } catch (error) {
    reply.code(500).send({ error: 'Failed to fetch gas stations' });
  }
};