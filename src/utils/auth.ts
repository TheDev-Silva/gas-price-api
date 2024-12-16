import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_TOKEN_WEB || '';

export const authMiddleware = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        return reply.code(401).send({ error: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
        request.user = decoded; // Adiciona os dados do usuário à requisição
    } catch (error) {
        return reply.code(401).send({ error: 'Invalid or expired token' });
    }
};
