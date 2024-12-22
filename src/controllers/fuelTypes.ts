import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';


const prisma = new PrismaClient();

export const addFuelType = async (
   request: FastifyRequest,
   reply: FastifyReply
) => {

   const fuelTypeSchema = z.object({
      name: z.string().min(1, 'O nome do tipo de combustível é obrigatório.'),
      createdBy: z.number().int().positive('ID do usuário é obrigatório e deve ser um número positivo.'),
   });

   try {
      // Valida o corpo da requisição
      const { name, createdBy } = fuelTypeSchema.parse(request.body);

      // Verifica se o usuário existe
      const userExists = await prisma.user.findUnique({
         where: { id: createdBy },
      });

      if (!userExists) {
         return reply.status(404).send({ error: 'Usuário não encontrado.' });
      }

      // Cria o novo tipo de combustível
      const newFuelType = await prisma.fuelType.create({
         data: {
            name,
            createdBy,
         },
      });

      reply.status(201).send(newFuelType);
   } catch (error) {
      console.error(error);

      if (error instanceof z.ZodError) {
         reply.status(400).send({ error: error.errors });
      } else {
         reply.status(500).send({ error: 'Erro ao criar tipo de combustível.' });
      }
   }
};


export const getFuelType = async (
   request: FastifyRequest,
   reply: FastifyReply
) => {
   // Rota para listar todos os tipos de combustível

   try {
      const fuelTypes = await prisma.fuelType.findMany({
         include: {
            user: {
               select: { name: true }, // Inclui o nome do usuário que criou o tipo
            },
         },
      });
      reply.send(fuelTypes);
   } catch (error) {
      console.error(error);
      reply.status(500).send({ error: 'Erro ao buscar tipos de combustível.' });
   }
};